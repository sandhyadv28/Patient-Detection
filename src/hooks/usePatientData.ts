import { useState } from 'react';
import { DatePreset, UsePatientDataReturn } from '../components/modals';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchPatientSummary } from '../store/slice/patientSlice';
import { RootState } from '../store/store';
import { getDatePresetRange } from '../utils/dataGenerator';

export function usePatientData(): UsePatientDataReturn {
  const dispatch = useAppDispatch();
  const patientState = useAppSelector((state: RootState) => state.patient);

  const [startDate, setStartDate] = useState(() => {
    const { start } = getDatePresetRange('last7');
    return start.format('YYYY-MM-DD');
  });

  const [endDate, setEndDate] = useState(() => {
    const { end } = getDatePresetRange('last7');
    return end.format('YYYY-MM-DD');
  });

  const [preset, setPreset] = useState<DatePreset>('last7');

  // Extract data from Redux state
  const { summaryData, isLoading, error } = patientState;

  // Convert Redux state to the expected format
  const convertedSummaryData = summaryData?.daily_breakdown?.map(day => ({
    date: day.date,
    totalBeds: day.total_entries,
    detected: day.total_detections,
    notDetected: day.total_undetected,
    ambiguous: 0, 
    detectedPercentage: day.detection_rate,
    notDetectedPercentage: day.undetected_rate,
    ambiguousPercentage: 0,
  })) || [];

  const convertedDayData: any[] = [];

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      dispatch(fetchPatientSummary({ startDate: start, endDate: end }));
    }
  };

  const handlePresetChange = (newPreset: DatePreset) => {
    setPreset(newPreset);

    if (newPreset !== 'custom') {
      const { start, end } = getDatePresetRange(newPreset);
      const startDateStr = start.format('YYYY-MM-DD');
      const endDateStr = end.format('YYYY-MM-DD');

      setStartDate(startDateStr);
      setEndDate(endDateStr);

      dispatch(fetchPatientSummary({ startDate: startDateStr, endDate: endDateStr }));
    }
  };

  return {
    dayData: convertedDayData,
    summaryData: convertedSummaryData,
    startDate,
    endDate,
    preset,
    isLoading,
    error,
    handleDateRangeChange,
    handlePresetChange,
  };
} 