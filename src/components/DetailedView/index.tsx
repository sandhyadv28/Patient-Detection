import { useEffect, useState } from 'react';
import ErrorMessage from '../../_common/ErrorMessage';
import LoadingSpinner from '../../_common/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { clearError, clearPerSlotDetailedData, fetchDetailedData, fetchPatientSummary, fetchPerSlotDetailedData } from '../../store/slice/patientSlice';
import { RootState } from '../../store/store';
import { getDatePresetRange } from '../../utils/dataGenerator';
import { API } from '../../service';
import DayHeader from './DayHeader';
import PhotoModal from './PhotoModal';
import TimeSlotCard from './TimeSlotCard';
import { DetailedViewProps, SLOT_KEYS } from './types';
import { createDefaultDayData, getDateRange } from './utils';

export default function DetailedView({ preset, startDate, endDate }: DetailedViewProps) {
  const dispatch = useAppDispatch();
  const { detailedDayData, summaryData, isLoadingDetailed, error, perSlotDetailedData, isPerSlotLoading } = useAppSelector((state: RootState) => state.patient);

  const [activeDay, setActiveDay] = useState(0);
  const [expandedSlots, setExpandedSlots] = useState<Set<string>>(new Set());
  const [photoModal, setPhotoModal] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Get date range once
  const dateRange = getDateRange(preset, startDate, endDate);

  // Generate days array
  const generateDaysArray = () => {
    const days: any[] = [];
    const { start, end } = dateRange;

    if (preset === 'previousMonth') {
      const daysInMonth = end.date();
      for (let i = daysInMonth; i >= 1; i--) {
        const date = start.clone().date(i).format('YYYY-MM-DD');
        const backendDay = summaryData?.daily_breakdown?.find(d => d.date === date);
        days.push(backendDay || createDefaultDayData(date));
      }
    } else {
      const daysDiff = end.diff(start, 'days') + 1;
      for (let i = 0; i < daysDiff; i++) {
        const currentDate = start.clone().add(i, 'days').format('YYYY-MM-DD');
        const backendDay = summaryData?.daily_breakdown?.find(d => d.date === currentDate);
        days.push(backendDay || createDefaultDayData(currentDate));
      }
    }

    return days;
  };

  const daysArr = generateDaysArray();
  const selectedDate = daysArr.length > activeDay ? daysArr[activeDay].date : '';
  const selectedDayObj = Object.assign({}, ...(detailedDayData || []));

  useEffect(() => {
    dispatch(fetchDetailedData(dateRange.firstDay));
  }, [dispatch, preset, startDate, endDate]);

  useEffect(() => {
    if (preset && preset !== 'custom') {
      const { start, end } = getDatePresetRange(preset);
      dispatch(fetchPatientSummary({
        startDate: start.format('YYYY-MM-DD'),
        endDate: end.format('YYYY-MM-DD')
      }));
    } else if (preset === 'custom' && startDate && endDate) {
      dispatch(fetchPatientSummary({ startDate, endDate }));
    }
  }, [dispatch, preset, startDate, endDate]);

  useEffect(() => {
    setActiveDay(0);
  }, [summaryData]);

  useEffect(() => {
    if (activeDay >= daysArr.length) {
      setActiveDay(0);
    }
  }, [activeDay, daysArr.length]);

  const handleRetry = () => {
    dispatch(clearError());

    if (preset && preset !== 'custom') {
      const { start, end } = getDatePresetRange(preset);
      dispatch(fetchPatientSummary({
        startDate: start.format('YYYY-MM-DD'),
        endDate: end.format('YYYY-MM-DD')
      }));
    } else if (preset === 'custom' && startDate && endDate) {
      dispatch(fetchPatientSummary({ startDate, endDate }));
    } else {
      dispatch(fetchDetailedData(dateRange.firstDay));
    }
  };

  const handleDayClick = (dayIndex: number) => {
    setActiveDay(dayIndex);
    dispatch(clearPerSlotDetailedData());
    setExpandedSlots(new Set());

    if (daysArr.length > dayIndex) {
      dispatch(fetchDetailedData(daysArr[dayIndex].date));
    }
  };

  const toggleSlotExpansion = async (timeSlot: string, slotKey: string) => {
    const newExpanded = new Set(expandedSlots);
    const isExpanding = !newExpanded.has(timeSlot);

    if (isExpanding) {
      newExpanded.add(timeSlot);
      setExpandedSlots(newExpanded);

      if (!perSlotDetailedData && daysArr.length > activeDay) {
        dispatch(fetchPerSlotDetailedData({
          date: daysArr[activeDay].date,
          slotKey: 'all_slots'
        }));
      }
    } else {
      newExpanded.delete(timeSlot);
      setExpandedSlots(newExpanded);
    }
  };

  const handleViewPhoto = async (imageKey: string) => {
    setPhotoModal(imageKey);
    setIsImageLoading(true);
    setImageError(null);

    try {
      const imageUrl = await API.fetchPatientImage(imageKey);
      setPhotoModal(imageUrl);
      setIsImageLoading(false);
    } catch (error) {
      setIsImageLoading(false);
      setImageError(error instanceof Error ? error.message : 'Failed to load image');
    }
  };

  const handleClosePhotoModal = () => {
    // Clean up blob URL if it exists
    if (photoModal && photoModal.startsWith('blob:')) {
      URL.revokeObjectURL(photoModal);
    }
    setPhotoModal(null);
    setIsImageLoading(false);
    setImageError(null);
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-4">
      <DayHeader
        daysArr={daysArr}
        activeDay={activeDay}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
      />

      {/* Loading State */}
      {isLoadingDetailed && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <LoadingSpinner size="lg" message="Loading detailed data..." />
        </div>
      )}

      {/* Time Slot Details */}
      {!isLoadingDetailed && (
        <div className="space-y-4">
          {detailedDayData && detailedDayData.length > 0 ? (
            SLOT_KEYS.map((slotKey, index) => {
              const slotData = selectedDayObj[slotKey];
              const isExpanded = expandedSlots.has(slotData?.label || `Slot ${index + 1}`);

              return (
                <TimeSlotCard
                  key={slotKey}
                  slotKey={slotKey}
                  slotIndex={index}
                  slotData={slotData}
                  isExpanded={isExpanded}
                  onToggleExpansion={toggleSlotExpansion}
                  perSlotDetailedData={perSlotDetailedData}
                  isPerSlotLoading={isPerSlotLoading}
                  onViewPhoto={handleViewPhoto}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-center">No detailed data available for the selected date.</p>
            </div>
          )}
        </div>
      )}

      <PhotoModal
        isOpen={!!photoModal}
        photoUrl={photoModal}
        isLoading={isImageLoading}
        error={imageError}
        onClose={handleClosePhotoModal}
      />
    </div>
  );
} 