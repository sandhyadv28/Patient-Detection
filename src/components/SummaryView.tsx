import React, { useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { formatDate } from '../utils/dataGenerator';
import SummaryCard from '../_common/SummaryCard';
import LoadingSpinner from '../_common/LoadingSpinner';
import ErrorMessage from '../_common/ErrorMessage';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { 
  fetchPatientSummary,
  clearError 
} from '../store/slice/patientSlice';
import { RootState } from '../store/store';

interface SummaryViewProps {
  startDate: string;
  endDate: string;
  preset: string;
}

export default function SummaryView({ startDate, endDate, preset }: SummaryViewProps) {
  const dispatch = useAppDispatch();
  
  const patientSummaryData = useAppSelector((state: RootState) => state.patient);
  const { summaryData = null, isLoading = false, error = null } = patientSummaryData || {};

  useEffect(() => {
    if (startDate && endDate && preset !== 'custom') {
      dispatch(fetchPatientSummary({ startDate, endDate }));
    }
  }, [dispatch, startDate, endDate, preset]);

  const handleRetry = () => {
    dispatch(clearError());
    if (startDate && endDate) {
      dispatch(fetchPatientSummary({ startDate, endDate }));
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading patient data..." />;
  }

  // Show error state
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  // Show empty state
  if (!summaryData || !summaryData.daily_breakdown || summaryData.daily_breakdown.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 text-center">No patient data available for the selected date range.</p>
      </div>
    );
  }

  // Destructure data directly where needed
  const { daily_breakdown, overall_summary } = summaryData;
  const totalAmbiguous = 0;

  return (
    <div className="space-y-4">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-4 gap-6">
        <SummaryCard
          title="Total Days"
          value={daily_breakdown.length}
          variant="primary"
        />
        <SummaryCard
          title="Total Detections"
          value={overall_summary.total_entries}
          variant="success"
        />
        <SummaryCard
          title="Patients Detected"
          value={overall_summary.total_detections}
          variant="info"
        />
        <SummaryCard
          title="Not Detected"
          value={overall_summary.total_undetected}
          variant="warning"
        />
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Daily Summary
              </h3>
              <p className="text-sm text-gray-600">
                {overall_summary.hospital} - {overall_summary.hospital_unit}
              </p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Detected
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Patients Detected
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Not Detected
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ambiguous
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {daily_breakdown.map((day, index) => (
                <tr key={day.date} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {formatDate(day.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-gray-600 font-medium">
                      {day.total_entries}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {day.total_detections}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        day.detection_rate >= 80 ? 'bg-green-100 text-green-800' :
                        day.detection_rate >= 60 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {day.total_undetected}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-gray-600 font-medium">
                      {totalAmbiguous}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}