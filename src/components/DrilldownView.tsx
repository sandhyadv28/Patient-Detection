import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Eye, Calendar } from 'lucide-react';
import { DayData, TimeSlotSummary, calculateTimeSlotSummary, formatDate } from '../utils/dataGenerator';

interface DrilldownViewProps {
  dayData: DayData[];
}

export default function DrilldownView({ dayData }: DrilldownViewProps) {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedSlots, setExpandedSlots] = useState<Set<string>>(new Set());
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  const toggleSlotExpansion = (timeSlot: string) => {
    const newExpanded = new Set(expandedSlots);
    if (newExpanded.has(timeSlot)) {
      newExpanded.delete(timeSlot);
    } else {
      newExpanded.add(timeSlot);
    }
    setExpandedSlots(newExpanded);
  };

  const currentDayData = dayData[activeDay];
  const timeSlotSummaries = currentDayData ? calculateTimeSlotSummary(currentDayData) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Yes': return 'bg-green-100 text-green-800';
      case 'No': return 'bg-red-100 text-red-800';
      case 'Ambiguous': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Day Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Day-wise Analysis
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto mb-6">
          {dayData.map((day, index) => (
            <button
              key={day.date}
              onClick={() => setActiveDay(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeDay === index
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
            </p>
          </div>
        )}
      </div>

      {/* Time Slot Details */}
      {currentDayData && (
        <div className="space-y-6">
          {timeSlotSummaries.map((summary) => (
            <div key={summary.timeSlot} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Time Slot Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
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
                    onClick={() => toggleSlotExpansion(summary.timeSlot)}
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
                              Bed ID
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
                          {summary.records.map((record) => (
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
                                <button
                                  onClick={() => setPhotoModal(record.photoUrl)}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  <Eye size={16} />
                                  View Photo
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
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