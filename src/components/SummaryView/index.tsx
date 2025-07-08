import React, { useEffect } from 'react';
import LoadingSpinner from '../../_common/LoadingSpinner';
import ErrorMessage from '../../_common/ErrorMessage';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { 
  fetchPatientSummary,
  clearError 
} from '../../store/slice/patientSlice';
import { RootState } from '../../store/store';
import SummaryMetrics from './SummaryMetrics';
import SummaryTable from './SummaryTable';

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

  return (
    <div className="space-y-4">
      <SummaryMetrics 
        dailyBreakdown={daily_breakdown}
        overallSummary={overall_summary}
      />
      <SummaryTable 
        dailyBreakdown={daily_breakdown}
        overallSummary={overall_summary}
      />
    </div>
  );
} 