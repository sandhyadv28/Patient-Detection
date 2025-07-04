import { Calendar, ChevronDown, ChevronRight, ExternalLink, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { clearError, fetchDetailedDrilldownData, fetchDrilldownData, fetchPerSlotDetailedData } from '../store/slice/patientSlice';
import { RootState } from '../store/store';
import { calculateTimeSlotSummary, formatDate } from '../utils/dataGenerator';
import ErrorMessage from './_common/ErrorMessage';
import LoadingSpinner from './_common/LoadingSpinner';

export default function DrilldownView() {
  const dispatch = useAppDispatch();

  // Add safety check for Redux state
  const patientState = useAppSelector((state: RootState) => state.patient);

  // Destructure with default values to prevent undefined errors
  const {
    dayData = [],
    detailedDayData = null,
    perSlotDetailedData = null,
    isLoading = false,
    isPerSlotLoading = false,
    error = null
  } = patientState || {};

  const [activeDay, setActiveDay] = useState(0);
  const [expandedSlots, setExpandedSlots] = useState<Set<string>>(new Set());
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDrilldownData());
  }, [dispatch]);

  // Fetch detailed data for the first day when drilldown data is loaded
  useEffect(() => {
    if (dayData.length > 0 && !detailedDayData) {
      console.log('Auto-fetching detailed data for today');
      dispatch(fetchDetailedDrilldownData());
    }
  }, [dayData, detailedDayData, dispatch]);

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchDrilldownData());
  };

  const handleDayClick = (dayIndex: number) => {
    setActiveDay(dayIndex);

    // Get the date for the selected day
    const selectedDay = dayData[dayIndex];
    if (selectedDay && selectedDay.date) {
      console.log(`Fetching detailed data for day ${dayIndex + 1} with date: ${selectedDay.date}`);
      dispatch(fetchDetailedDrilldownData(selectedDay.date));
    } else {
      // If no specific date, use today's date
      console.log('Fetching detailed data for today');
      dispatch(fetchDetailedDrilldownData());
    }
  };

  // Helper to get slot key by index
  const getSlotKeyByIndex = (index: number) => {
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
    return slotKeys[index] || '';
  };

  const toggleSlotExpansion = (timeSlot: string, slotIndex: number) => {
    const newExpanded = new Set(expandedSlots);
    if (newExpanded.has(timeSlot)) {
      newExpanded.delete(timeSlot);
    } else {
      newExpanded.add(timeSlot);
      // Fetch per-slot detailed data for this slot
      const currentDayData = detailedDayData || dayData[activeDay];
      if (currentDayData && currentDayData.date) {
        const slotKey = getSlotKeyByIndex(slotIndex);
        dispatch(fetchPerSlotDetailedData({ date: currentDayData.date, slotKey }));
      }
    }
    setExpandedSlots(newExpanded);
  };

  // Show loading state only for main data loading, not per-slot loading
  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading drilldown data..." />;
  }

  // Show error state
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  // Show empty state
  if (!dayData || dayData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 text-center">No drilldown data available.</p>
      </div>
    );
  }

  // Use per-slot detailed data if available, otherwise fall back to detailed data, then regular day data
  const currentDayData = perSlotDetailedData || detailedDayData || dayData[activeDay];
  const timeSlotSummaries = currentDayData ? calculateTimeSlotSummary(currentDayData) : [];

  // Check if we're showing per-slot detailed data
  const isPerSlotDetailedData = perSlotDetailedData !== null;

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
      {/* Day Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Day-wise Analysis
          </h3>
        </div>

        <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto mb-4">
          {dayData.map((day, index) => (
            <button
              key={day.date}
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

        {currentDayData && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-800 font-medium">
              Selected: {formatDate(currentDayData.date)}
              {isPerSlotDetailedData && <span className="ml-2 text-sm text-green-600">(Per-Slot Detailed Data)</span>}
              {!isPerSlotDetailedData && detailedDayData && <span className="ml-2 text-sm text-blue-600">(Detailed Data)</span>}
            </p>
          </div>
        )}
      </div>

      {/* Time Slot Details */}
      {currentDayData && (
        <div className="space-y-4">
          {timeSlotSummaries.map((summary, idx) => (
            <div key={summary.timeSlot} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Time Slot Header */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {summary.timeSlot}
                      </h4>
                      <p className="text-sm text-gray-600">Time slot analysis</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSlotExpansion(summary.timeSlot, idx)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-all border border-gray-200"
                  >
                    {expandedSlots.has(summary.timeSlot) ? (
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
                    <p className="text-2xl font-bold text-gray-900">{summary.totalBeds}</p>
                    <p className="text-sm text-gray-600 mt-1">Total Beds</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">{summary.detectedPercentage}%</p>
                    <p className="text-sm text-green-600 mt-1">Detected ({summary.detected})</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <p className="text-2xl font-bold text-red-600">{summary.notDetectedPercentage}%</p>
                    <p className="text-sm text-red-600 mt-1">Not Detected ({summary.notDetected})</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <p className="text-2xl font-bold text-orange-600">{summary.ambiguousPercentage}%</p>
                    <p className="text-sm text-orange-600 mt-1">Ambiguous ({summary.ambiguous})</p>
                  </div>
                </div>
              </div>

              {/* Detailed Records */}
              {expandedSlots.has(summary.timeSlot) && (
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
                        {isPerSlotLoading ? (
                          <tr>
                            <td colSpan={3}>
                              <LoadingSpinner size="md" message="Loading bed details..." />
                            </td>
                          </tr>
                        ) : (
                          <tbody className="divide-y divide-gray-200">
                            {(perSlotDetailedData && perSlotDetailedData.records.length > 0
                              ? perSlotDetailedData.records
                              : currentDayData.records.filter(record => record.timeSlot === summary.timeSlot)
                            ).map((record) => (
                              <tr key={record.bedId} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Bed {record.bedId}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                    {record.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-center">
                                  {record.photoUrl ? (
                                    <button
                                      onClick={() => setPhotoModal(record.photoUrl)}
                                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                      <Eye size={16} />
                                      View Photo
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      No photo available
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {photoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setPhotoModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Patient Detection Photo
              </h3>
              <button
                onClick={() => setPhotoModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <img
              src={photoModal}
              alt="Patient detection"
              className="w-full h-auto rounded-xl shadow-lg"
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
        </div>
      )}
    </div>
  );
}