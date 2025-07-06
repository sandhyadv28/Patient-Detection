import { Calendar, ChevronDown, ChevronRight, ExternalLink, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { clearError, fetchDetailedDrilldownData } from '../store/slice/patientSlice';
import { RootState } from '../store/store';
import { formatDate } from '../utils/dataGenerator';
import { getImageUrl } from '../service/imageApi';
import ErrorMessage from '../_common/ErrorMessage';
import LoadingSpinner from '../_common/LoadingSpinner';
import moment from 'moment';

export default function DrilldownView() {
  const dispatch = useAppDispatch();
  const patientDetailedData = useAppSelector((state: RootState) => state.patient);
  const { detailedDayData = null, isLoading = false, error = null } = patientDetailedData || {};

  const [activeDay, setActiveDay] = useState(0);
  const [expandedSlots, setExpandedSlots] = useState<Set<string>>(new Set());
  const [photoModal, setPhotoModal] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Fetch detailed data when component mounts
  useEffect(() => {
    console.log('Fetching detailed data for today');
    dispatch(fetchDetailedDrilldownData(moment().format('YYYY-MM-DD')));
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchDetailedDrilldownData(moment().format('YYYY-MM-DD')));
  };

  const handleDayClick = (dayIndex: number) => {
    setActiveDay(dayIndex);

    // Get the date for the selected day from the first slot object
    const selectedDayObj = days[dayIndex] || {};
    const firstSlot = Object.values(selectedDayObj)[0] as any;
    const selectedDate = firstSlot?.date;
    if (selectedDate) {
      console.log(`Fetching detailed data for day ${dayIndex + 1} with date: ${selectedDate}`);
      dispatch(fetchDetailedDrilldownData(selectedDate));
    } else {
      // If no specific date, use today's date
      console.log('Fetching detailed data for today');
      dispatch(fetchDetailedDrilldownData(moment().format('YYYY-MM-DD')));
    }
  };

  const toggleSlotExpansion = (timeSlot: string) => {
    const newExpanded = new Set(expandedSlots);
    if (newExpanded.has(timeSlot)) {
      newExpanded.delete(timeSlot);
    } else {
      newExpanded.add(timeSlot);
    }
    setExpandedSlots(newExpanded);
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
      const imageUrl = await getImageUrl(imageKey);
      setPhotoModal(imageUrl);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Failed to load image');
      setPhotoModal('error');
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleClosePhotoModal = () => {
    if (photoModal && photoModal.startsWith('blob:')) {
      URL.revokeObjectURL(photoModal);
    }
    setPhotoModal(null);
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading drilldown data..." />;
  }

  // Show error state
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  // Show empty state
  if (!detailedDayData) {
    console.log('No detailed day data available');
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 text-center">No drilldown data available.</p>
      </div>
    );
  }

  if (!Array.isArray(detailedDayData) || detailedDayData.length === 0) {
    console.log('Detailed day data is not an array or is empty');
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 text-center">No drilldown data available.</p>
      </div>
    );
  }

  // Always show all 8 slots, even if missing in API response
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

  // For multiple days, detailedDayData is an array of day objects
  // Each day object is an object with slot keys and a 'date' property
  type SlotData = { label?: string; overall?: { total_entries?: number; total_detections?: number; total_undetected?: number; detection_rate?: number; undetected_rate?: number } };
  type DayObj = { [key: string]: SlotData };
  const days: DayObj[] = (detailedDayData || []).slice(0, 7);
  // Flatten the array of slot objects into a single object
  const selectedDayObj: DayObj = Object.assign({}, ...days);

  // Get the date for the selected day from the first slot object
  const firstSlot = Object.values(selectedDayObj)[0] as any;
  const selectedDate = firstSlot?.date || '';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Yes': return 'bg-green-100 text-green-800';
      case 'No': return 'bg-red-100 text-red-800';
      case 'Ambiguous': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          {days.map((_, index) => (
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
            Selected: {selectedDate ? formatDate(selectedDate) : formatDate(moment().format('YYYY-MM-DD'))}
          </p>
        </div>
      </div>

      {/* Time Slot Details */}
      <div className="space-y-4">
        {slotKeys.map((slotKey, idx) => {
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

          // Debug logs for label issue
          console.log('Slot Debug:', { slotKey, slotData, label, slotInfoLabel: slotInfo.label });

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
                    onClick={() => toggleSlotExpansion(slotInfo.label)}
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
                    <p className="text-2xl font-bold text-green-600">{slotInfo.detection_rate}%</p>
                    <p className="text-sm text-green-600 mt-1">Detected ({slotInfo.total_detections})</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <p className="text-2xl font-bold text-red-600">{slotInfo.undetected_rate}%</p>
                    <p className="text-sm text-red-600 mt-1">Not Detected ({slotInfo.total_undetected})</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <p className="text-2xl font-bold text-orange-600">0%</p>
                    <p className="text-sm text-orange-600 mt-1">Ambiguous (0)</p>
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
                          {Array.from({ length: slotInfo.total_entries }, (_, index) => {
                            const isDetected = index < slotInfo.total_detections;
                            return (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Bed {index + 1}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(isDetected ? 'Yes' : 'No')}`}>
                                    {isDetected ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className="text-gray-400 text-sm">
                                    No photo available
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
                    onError={() => setImageError('Failed to load image')}
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