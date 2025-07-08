import { Eye } from 'lucide-react';
import LoadingSpinner from '../../_common/LoadingSpinner';
import { getStatusColor } from './utils';
import { BedDetailsTableProps } from './types';

export default function BedDetailsTable({ slotKey, perSlotDetailedData, isPerSlotLoading, onViewPhoto }: BedDetailsTableProps) {
  const getSlotData = () => {
    if (!perSlotDetailedData || !Array.isArray(perSlotDetailedData)) {
      return null;
    }
    
    // Direct array index access based on slot number (most efficient)
    const slotNumber = slotKey.replace('slot_', '')
      .replace('one', '1').replace('two', '2').replace('three', '3')
      .replace('four', '4').replace('five', '5').replace('six', '6')
      .replace('seven', '7').replace('eight', '8');
    const slotIndex = parseInt(slotNumber) - 1;

    if (perSlotDetailedData[slotIndex] && perSlotDetailedData[slotIndex][slotKey]) {
      return perSlotDetailedData[slotIndex][slotKey];
    }
    
    return null;
  };

  const slotData = getSlotData();

  return (
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
          ) : slotData && slotData.per_bed && Array.isArray(slotData.per_bed) && slotData.per_bed.length > 0 ? (
            slotData.per_bed.map((bed: any, index: number) => (
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
  );
} 