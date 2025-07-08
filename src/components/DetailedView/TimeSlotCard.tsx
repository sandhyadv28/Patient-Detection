import { Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import BedDetailsTable from './BedDetailsTable';
import { TimeSlotCardProps } from './types';

export default function TimeSlotCard({
  slotKey,
  slotIndex,
  slotData,
  isExpanded,
  onToggleExpansion,
  perSlotDetailedData,
  isPerSlotLoading,
  onViewPhoto
}: TimeSlotCardProps) {
  if (!slotData || !slotData.overall) {
    return null;
  }

  const { label, overall } = slotData;
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
        <div className="border-t border-gray-200">
          <div className="p-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Bed Details</h5>
            <BedDetailsTable
              slotKey={slotKey}
              perSlotDetailedData={perSlotDetailedData}
              isPerSlotLoading={isPerSlotLoading}
              onViewPhoto={onViewPhoto}
            />
          </div>
        </div>
      )}
    </div>
  );
} 