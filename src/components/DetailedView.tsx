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

export default function DetailedView({ preset, startDate, endDate }: DetailedViewProps) {
  const dispatch = useAppDispatch();
  const patientDetailedData = useAppSelector((state: RootState) => state.patient);
  const { detailedDayData = null, summaryData = null, isLoading = false, error = null, perSlotDetailedData = null, isPerSlotLoading = false } = patientDetailedData || {};

  const [activeDay, setActiveDay] = useState(0);
  const [expandedSlots, setExpandedSlots] = useState<Set<string>>(new Set());
  const [photoModal, setPhotoModal] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Map slot keys to time labels
  const getSlotTimeLabel = (slotKey: string): string => {
    const timeSlotMap: { [key: string]: string } = {
      'slot_one': '6AM',
      'slot_two': '9AM',
      'slot_three': '12PM',
      'slot_four': '3PM',
      'slot_five': '6PM',
      'slot_six': '9PM',
      'slot_seven': '12AM',
      'slot_eight': '3AM'
    };
    return timeSlotMap[slotKey] || slotKey;
  };

  // Fetch detailed data when component mounts or when summary data changes
  useEffect(() => {
    // Generate days array to get the first day's date
    let firstDayDate = moment().format('YYYY-MM-DD');

    if (preset === 'previousMonth') {
      const prevMonth = moment().subtract(1, 'month');
      firstDayDate = prevMonth.clone().startOf('month').format('YYYY-MM-DD');
    } else if (preset === 'custom' && startDate && endDate) {
      firstDayDate = startDate;
    } else if (preset === 'last30') {
      firstDayDate = moment().subtract(29, 'days').format('YYYY-MM-DD');
    } else {
      // Default to last 7 days
      firstDayDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
    }

    dispatch(fetchDetailedData(firstDayDate));
  }, [dispatch, preset, startDate, endDate]);

  // Handle preset changes and fetch summary data with date range
  useEffect(() => {
    if (preset && preset !== 'custom') {
      const { start, end } = getDatePresetRange(preset);
      const startDateStr = start.format('YYYY-MM-DD');
      const endDateStr = end.format('YYYY-MM-DD');
      dispatch(fetchPatientSummary({ startDate: startDateStr, endDate: endDateStr }));
    } else if (preset === 'custom' && startDate && endDate) {
      dispatch(fetchPatientSummary({ startDate, endDate }));
    }
  }, [dispatch, preset, startDate, endDate]);

  useEffect(() => {
    setActiveDay(0);
  }, [summaryData]);

  const handleRetry = () => {
    dispatch(clearError());

    if (preset && preset !== 'custom') {
      const { start, end } = getDatePresetRange(preset);
      const startDateStr = start.format('YYYY-MM-DD');
      const endDateStr = end.format('YYYY-MM-DD');
      dispatch(fetchPatientSummary({ startDate: startDateStr, endDate: endDateStr }));
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

    if (daysArr && daysArr.length > dayIndex) {
      const selectedDate = daysArr[dayIndex].date;
      dispatch(fetchDetailedData(selectedDate));
    }
  };

  const toggleSlotExpansion = async (timeSlot: string, slotKey: string) => {
    const newExpanded = new Set(expandedSlots);
    const isExpanding = !newExpanded.has(timeSlot);

    if (isExpanding) {
      newExpanded.add(timeSlot);
      setExpandedSlots(newExpanded);

      if (!perSlotDetailedData) {
        if (daysArr && daysArr.length > activeDay) {
          const selectedDate = daysArr[activeDay].date;
          dispatch(fetchPerSlotDetailedData({ date: selectedDate, slotKey: 'all_slots' }));
        }
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

  if (!isLoading && (!detailedDayData || !Array.isArray(detailedDayData) || detailedDayData.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 text-center">No detailed data available.</p>
      </div>
    );
  }

  const slotKeys = [
    'slot_one',
    'slot_two',
    'slot_three',
    'slot_four',
    'slot_five',
    'slot_six',
    'slot_seven',
    'slot_eight',
  ];

  type SlotData = { label?: string; overall?: { total_entries?: number; total_detections?: number; total_undetected?: number; detection_rate?: number; undetected_rate?: number } };
  type DayObj = { [key: string]: SlotData };

  let daysArr: any[] = [];

  // Generate days array based on preset
  if (preset === 'previousMonth') {
    const prevMonth = moment().subtract(1, 'month');
    const startOfPrevMonth = prevMonth.clone().startOf('month');
    const endOfPrevMonth = prevMonth.clone().endOf('month');
    const daysInPrevMonth = endOfPrevMonth.date();
    for (let i = daysInPrevMonth; i >= 1; i--) {
      const date = startOfPrevMonth.clone().date(i).format('YYYY-MM-DD');
      const backendDay = summaryData?.daily_breakdown?.find(d => d.date === date);
      daysArr.push(
        backendDay || {
          date,
          hospital: '',
          hospital_unit: '',
          total_entries: 0,
          total_detections: 0,
          total_undetected: 0,
          detection_rate: 0,
          undetected_rate: 0,
        }
      );
    }
  } else if (preset === 'custom' && startDate && endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    const daysDiff = end.diff(start, 'days') + 1;

    for (let i = 0; i < daysDiff; i++) {
      const currentDate = start.clone().add(i, 'days').format('YYYY-MM-DD');
      const backendDay = summaryData?.daily_breakdown?.find(d => d.date === currentDate);
      daysArr.push(
        backendDay || {
          date: currentDate,
          hospital: '',
          hospital_unit: '',
          total_entries: 0,
          total_detections: 0,
          total_undetected: 0,
          detection_rate: 0,
          undetected_rate: 0,
        }
      );
    }
  } else if (preset === 'last30') {
    // Generate 30 days from today backwards
    for (let i = 29; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const backendDay = summaryData?.daily_breakdown?.find(d => d.date === date);
      daysArr.push(
        backendDay || {
          date,
          hospital: '',
          hospital_unit: '',
          total_entries: 0,
          total_detections: 0,
          total_undetected: 0,
          detection_rate: 0,
          undetected_rate: 0,
        }
      );
    }
  } else {
    // Default to last 7 days (last7 preset)
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const backendDay = summaryData?.daily_breakdown?.find(d => d.date === date);
      daysArr.push(
        backendDay || {
          date,
          hospital: '',
          hospital_unit: '',
          total_entries: 0,
          total_detections: 0,
          total_undetected: 0,
          detection_rate: 0,
          undetected_rate: 0,
        }
      );
    }
  }

  // Fix activeDay if it's out of bounds for the current daysArr
  if (activeDay >= daysArr.length) {
    setActiveDay(0);
  }

  const selectedDayObj: DayObj = Object.assign({}, ...(detailedDayData || []));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Yes': return 'bg-green-100 text-green-800';
      case 'No': return 'bg-red-100 text-red-800';
      case 'Ambiguous': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  let selectedDate = '';
  if (daysArr && daysArr.length > activeDay) {
    selectedDate = daysArr[activeDay].date;
  } else {
    selectedDate = moment().format('YYYY-MM-DD');
  }

  return (
    <div className="space-y-4">
      {/* Day Header */}
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
              onClick={() => handleDayClick(index)}
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

      {/* Time Slot Details */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <LoadingSpinner size="lg" message="Loading detailed data..." />
          </div>
        ) : (
          slotKeys.map((slotKey, idx) => {
            const slotData = selectedDayObj[slotKey];
            const { label, overall } = slotData || {};
            const slotInfo = {
              label: label || `Slot ${idx + 1}`,
              total_entries: overall?.total_entries || 0,
              total_detections: overall?.total_detections || 0,
              total_undetected: overall?.total_undetected || 0,
              detection_rate: overall?.detection_rate || 0,
              undetected_rate: overall?.undetected_rate || 0
            };

            return (
              <div key={slotKey} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
                      onClick={(e) => { e.stopPropagation(); toggleSlotExpansion(slotInfo.label, slotKey); }}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-all border border-gray-200"
                    >
                      {expandedSlots.has(slotInfo.label) ? (
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
                      <p className="text-2xl font-bold text-green-600"> {slotInfo.total_detections}</p>
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
                {expandedSlots.has(slotInfo.label) && (
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
                            ) : perSlotDetailedData && perSlotDetailedData.length > 0 ? (
                              (() => {
                                let slotData: any = null;

                                // Direct array index access based on slot number (most efficient)
                                const slotNumber = slotKey.replace('slot_', '').replace('one', '1').replace('two', '2').replace('three', '3').replace('four', '4').replace('five', '5').replace('six', '6').replace('seven', '7').replace('eight', '8');
                                const slotIndex = parseInt(slotNumber) - 1;

                                if (perSlotDetailedData[slotIndex] && perSlotDetailedData[slotIndex][slotKey]) {
                                  slotData = perSlotDetailedData[slotIndex][slotKey];
                                }

                                if (slotData && slotData.per_bed && Array.isArray(slotData.per_bed) && slotData.per_bed.length > 0) {
                                  return slotData.per_bed.map((bed: any, index: number) => (
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
                                            onClick={() => handleViewPhoto(bed.imageURL!)}
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
                                  ));
                                } else {
                                  return (
                                    <tr>
                                      <td colSpan={3} className="px-4 py-8 text-center">
                                        <p className="text-gray-600">No bed details available for this time slot.</p>
                                      </td>
                                    </tr>
                                  );
                                }
                              })()
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
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Photo Modal */}
      {photoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={handleClosePhotoModal}>
          <div className="bg-white rounded-2xl p-4 w-[36rem] h-[52vh] shadow-2xl relative z-[10000]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Patient Detection Photo
              </h3>
              <button
                onClick={handleClosePhotoModal}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="w-full h-80 flex items-center justify-center">
              {photoModal === 'loading' || isImageLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="md" message="Loading image..." />
                </div>
              ) : photoModal === 'error' || imageError ? (
                <div className="text-center">
                  <p className="text-red-600 mb-2">Failed to load image</p>
                  <p className="text-gray-600 text-sm">{imageError}</p>
                  <button
                    onClick={handleClosePhotoModal}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  <img
                    src={photoModal}
                    alt="Patient detection"
                    className="w-full h-full rounded-xl shadow-lg"
                    onLoad={() => { }}
                    onError={(e) => {
                      setImageError('Failed to load image');
                    }}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Click outside to close</p>
                    <a
                      href={photoModal}
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
      )}
    </div>
  );
}