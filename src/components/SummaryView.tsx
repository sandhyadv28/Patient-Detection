import React, { useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { formatDate } from '../utils/dataGenerator';
import SummaryCards from '../_common/SummaryCard';
import LoadingSpinner from '../_common/LoadingSpinner';
import ErrorMessage from '../_common/ErrorMessage';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchPatientSummary, clearError } from '../store/slice/patientSlice';
import { RootState } from '../store/store';

interface SummaryViewProps {
  startDate: string;
  endDate: string;
  preset: string;
}

export default function SummaryView({ startDate, endDate, preset }: SummaryViewProps) {
  const dispatch = useAppDispatch();
  
  // Add safety check for Redux state
  const patientState = useAppSelector((state: RootState) => state.patient);
  console.log('patientState', patientState);
  
  // Destructure with default values to prevent undefined errors
  const { 
    summaryData = [], 
    isLoading = false, 
    error = null 
  } = patientState || {};

  useEffect(() => {
    if (startDate && endDate && preset !== 'custom') {
      console.log('=== SummaryView: Making API call ===');
      console.log('Date range:', { startDate, endDate });
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
  if (!summaryData || summaryData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 text-center">No patient data available for the selected date range.</p>
      </div>
    );
  }

  const totalDays = summaryData.length;
  const avgDetectionRate = summaryData.length > 0 
    ? Math.round(summaryData.reduce((sum, day) => sum + day.detectedPercentage, 0) / summaryData.length)
    : 0;
  const totalPatientDetections = summaryData.reduce((sum, day) => sum + day.detected, 0);
  const totalAmbiguous = summaryData.reduce((sum, day) => sum + day.ambiguous, 0);

  const summaryValues = {
    totalDays,
    avgDetectionRate,
    totalPatientDetections,
    totalAmbiguous,
  };

  return (
    <div className="space-y-4">
      {/* Key Metrics Cards */}
      <SummaryCards summaryValues={summaryValues} />

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
              <p className="text-sm text-gray-600">Patient detection analysis by day</p>
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
                  Patients Detected
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Detection Rate
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
              {summaryData.map((day, index) => (
                <tr key={day.date} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {formatDate(day.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {day.detected}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        day.detectedPercentage >= 80 ? 'bg-green-100 text-green-800' :
                        day.detectedPercentage >= 60 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {day.detectedPercentage}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-gray-600 font-medium">
                      {day.notDetected} ({day.notDetectedPercentage}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-orange-600 font-medium">
                      {day.ambiguous} ({day.ambiguousPercentage}%)
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