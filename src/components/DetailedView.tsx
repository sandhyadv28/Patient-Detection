import { Calendar, ChevronDown, ChevronRight, ExternalLink, Eye } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ErrorMessage from '../_common/ErrorMessage';
import LoadingSpinner from '../_common/LoadingSpinner';
import { API } from '../service';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { clearError, clearPerSlotDetailedData, fetchDetailedData, fetchPatientSummary, fetchPerSlotDetailedData } from '../store/slice/patientSlice';
import { RootState } from '../store/store';
import { formatDate, getDatePresetRange } from '../utils/dataGenerator';

type DetailedViewProps = {
  preset: string;
  startDate?: string;
  endDate?: string;
};

type SlotData = {
  label?: string;
  overall?: {
    total_entries?: number;
    total_detections?: number;
    total_undetected?: number;
    detection_rate?: number;
    undetected_rate?: number
  }
};

const SLOT_KEYS = [
  'slot_one', 'slot_two', 'slot_three', 'slot_four',
  'slot_five', 'slot_six', 'slot_seven', 'slot_eight',
] as const;

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Yes': return 'bg-green-100 text-green-800';
    case 'No': return 'bg-red-100 text-red-800';
    case 'Ambiguous': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const createDefaultDayData = (date: string) => ({
  date,
  hospital: '',
  hospital_unit: '',
  total_entries: 0,
  total_detections: 0,
  total_undetected: 0,
  detection_rate: 0,
  undetected_rate: 0,
});

const getDateRange = (preset: string, startDate?: string, endDate?: string) => {
  if (preset === 'previousMonth') {
    const prevMonth = moment().subtract(1, 'month');
    return {
      start: prevMonth.clone().startOf('month'),
      end: prevMonth.clone().endOf('month'),
      firstDay: prevMonth.clone().startOf('month').format('YYYY-MM-DD')
    };
  } else if (preset === 'custom' && startDate && endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    return {
      start,
      end,
      firstDay: startDate
    };
  } else if (preset === 'last30') {
    const start = moment().subtract(29, 'days');
    const end = moment();
    return {
      start,
      end,
      firstDay: start.format('YYYY-MM-DD')
    };
  } else {
    // Default to last 7 days
    const start = moment().subtract(6, 'days');
    const end = moment();
    return {
      start,
      end,
      firstDay: start.format('YYYY-MM-DD')
    };
  }
};

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
  const selectedDate = daysArr.length > activeDay ? daysArr[activeDay].date : moment().format('YYYY-MM-DD');
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
      dispatch(fetchDetailedData(moment().format('YYYY-MM-DD')));
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
    if (!imageKey) {
      setImageError('No image key available');
      return;
    }

    setPhotoModal('loading');
    setIsImageLoading(true);
    setImageError(null);

    try {
      const imageUrl = await API.fetchPatientImage(imageKey);
      setPhotoModal(imageUrl);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Failed to load image');
      setPhotoModal('error');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleClosePhotoModal = () => {
    setPhotoModal(null);
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (isLoadingDetailed) {
    return (
      <div className="space-y-4">
        {/* Day Header - Always show this */}
        <DayHeader
          daysArr={daysArr}
          activeDay={activeDay}
          selectedDate={selectedDate}
          onDayClick={handleDayClick}
        />

        {/* Loading Spinner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <LoadingSpinner size="lg" message="Loading detailed data..." />
        </div>
      </div>
    );
  }

  if (!detailedDayData || !Array.isArray(detailedDayData) || detailedDayData.length === 0) {
    return (
      <div className="space-y-4">
        {/* Day Header - Always show this */}
        <DayHeader
          daysArr={daysArr}
          activeDay={activeDay}
          selectedDate={selectedDate}
          onDayClick={handleDayClick}
        />

        {/* No Data Message */}
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-center">No detailed data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Day Header */}
      <DayHeader
        daysArr={daysArr}
        activeDay={activeDay}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
      />

      {/* Time Slot Details */}
      <div className="space-y-4">
        {SLOT_KEYS.map((slotKey, idx) => (
          <TimeSlotCard
            key={slotKey}
            slotKey={slotKey}
            slotIndex={idx}
            slotData={selectedDayObj[slotKey]}
            isExpanded={expandedSlots.has(selectedDayObj[slotKey]?.label || `Slot ${idx + 1}`)}
            onToggleExpansion={toggleSlotExpansion}
            perSlotDetailedData={perSlotDetailedData}
            isPerSlotLoading={isPerSlotLoading}
            onViewPhoto={handleViewPhoto}
          />
        ))}
      </div>

      {/* Photo Modal */}
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

// Sub-components for better organization
type DayHeaderProps = {
  daysArr: any[];
  activeDay: number;
  selectedDate: string;
  onDayClick: (dayIndex: number) => void;
};

function DayHeader({ daysArr, activeDay, selectedDate, onDayClick }: DayHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="text-blue-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Day-wise Analysis
        </h3>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto mb-4">
        {daysArr.map((day, index) => (
          <button
            key={index}
            onClick={() => onDayClick(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeDay === index
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
          >
            Day {index + 1}
          </button>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-blue-800 font-medium">
          Selected: {formatDate(selectedDate)}
        </p>
      </div>
    </div>
  );
}

type TimeSlotCardProps = {
  slotKey: string;
  slotIndex: number;
  slotData: SlotData;
  isExpanded: boolean;
  onToggleExpansion: (timeSlot: string, slotKey: string) => void;
  perSlotDetailedData: any;
  isPerSlotLoading: boolean;
  onViewPhoto: (imageKey: string) => void;
};

function TimeSlotCard({
  slotKey,
  slotIndex,
  slotData,
  isExpanded,
  onToggleExpansion,
  perSlotDetailedData,
  isPerSlotLoading,
  onViewPhoto
}: TimeSlotCardProps) {
  const { label, overall } = slotData || {};
  const slotInfo = {
    label: label || `Slot ${slotIndex + 1}`,
    total_entries: overall?.total_entries || 0,
    total_detections: overall?.total_detections || 0,
    total_undetected: overall?.total_undetected || 0,
    detection_rate: overall?.detection_rate || 0,
    undetected_rate: overall?.undetected_rate || 0
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Time Slot Header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={16} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {slotInfo.label}
              </h4>
              <p className="text-sm text-gray-600">Time slot analysis</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion(slotInfo.label, slotKey);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-all border border-gray-200"
          >
            {isExpanded ? (
              <>
                <ChevronDown size={16} />
                Hide Details
              </>
            ) : (
              <>
                <ChevronRight size={16} />
                Show Details
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">{slotInfo.total_entries}</p>
            <p className="text-sm text-gray-600 mt-1">Total Detections</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{slotInfo.total_detections}</p>
            <p className="text-sm text-green-600 mt-1">Detected</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-2xl font-bold text-red-600">{slotInfo.total_undetected}</p>
            <p className="text-sm text-red-600 mt-1">Not Detected</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-sm text-orange-600 mt-1">Ambiguous</p>
          </div>
        </div>
      </div>

      {/* Detailed Records */}
      {isExpanded && (
        <BedDetailsTable
          slotKey={slotKey}
          perSlotDetailedData={perSlotDetailedData}
          isPerSlotLoading={isPerSlotLoading}
          onViewPhoto={onViewPhoto}
        />
      )}
    </div>
  );
}

type BedDetailsTableProps = {
  slotKey: string;
  perSlotDetailedData: any;
  isPerSlotLoading: boolean;
  onViewPhoto: (imageKey: string) => void;
};

function BedDetailsTable({ slotKey, perSlotDetailedData, isPerSlotLoading, onViewPhoto }: BedDetailsTableProps) {
  const getSlotData = () => {
    if (!perSlotDetailedData || !Array.isArray(perSlotDetailedData)) return null;

    const slotNumber = slotKey.replace('slot_', '')
      .replace('one', '1').replace('two', '2').replace('three', '3')
      .replace('four', '4').replace('five', '5').replace('six', '6')
      .replace('seven', '7').replace('eight', '8');
    const slotIndex = parseInt(slotNumber) - 1;

    return perSlotDetailedData[slotIndex]?.[slotKey];
  };

  const slotData = getSlotData();
  const bedData = slotData?.per_bed;

  return (
    <div className="border-t border-gray-200">
      <div className="p-6">
        <h5 className="text-lg font-semibold text-gray-900 mb-4">Bed Details</h5>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bed No.
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Detection Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  View Photo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isPerSlotLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8">
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="md" message="Loading bed details..." />
                    </div>
                  </td>
                </tr>
              ) : bedData && Array.isArray(bedData) && bedData.length > 0 ? (
                bedData.map((bed: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Bed {bed.bed_no}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bed.detection_status ? 'Yes' : 'No')}`}>
                        {bed.detection_status ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {bed.imageURL ? (
                        <button
                          onClick={() => onViewPhoto(bed.imageURL)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Eye size={14} />
                          View Photo
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No photo available
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center">
                    <p className="text-gray-600">No bed details available for this time slot.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type PhotoModalProps = {
  isOpen: boolean;
  photoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
};

function PhotoModal({ isOpen, photoUrl, isLoading, error, onClose }: PhotoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 w-[36rem] h-[52vh] shadow-2xl relative z-[10000]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Patient Detection Photo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="w-full h-80 flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="md" message="Loading image..." />
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load image</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <img
                src={photoUrl!}
                alt="Patient detection"
                className="w-full h-full rounded-xl shadow-lg"
                onError={() => {
                  // Handle image load error if needed
                }}
              />
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Click outside to close</p>
                <a
                  href={photoUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  Open in new tab
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}