import { useState, useEffect } from 'react';
import { DayData, SummaryData, DatePreset } from '../types';
import { generateDummyData, calculateSummaryData, getDatePresetRange } from '../utils/dataGenerator';
import { APP_CONFIG, UI_CONFIG } from '../utils/constants';
import { validateDateRange } from '../utils/validation';

interface UsePatientDataReturn {
  dayData: DayData[];
  summaryData: SummaryData[];
  startDate: string;
  endDate: string;
  preset: DatePreset;
  isLoading: boolean;
  error: string | null;
  handleDateRangeChange: (start: string, end: string) => void;
  handlePresetChange: (newPreset: DatePreset) => void;
}

export function usePatientData(): UsePatientDataReturn {
  const [preset, setPreset] = useState<DatePreset>(APP_CONFIG.DEFAULT_DATE_PRESET);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dayData, setDayData] = useState<DayData[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with default date range
  useEffect(() => {
    const { start, end } = getDatePresetRange(APP_CONFIG.DEFAULT_DATE_PRESET);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  // Generate data when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      setIsLoading(true);
      setError(null);
      
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Validate date range before processing
        const validation = validateDateRange(start, end);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        
        const generatedDayData = generateDummyData(start, end);
        const generatedSummaryData = calculateSummaryData(generatedDayData);
        
        setDayData(generatedDayData);
        setSummaryData(generatedSummaryData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : UI_CONFIG.ERROR_MESSAGES.DATA_LOAD_FAILED;
        setError(errorMessage);
        console.error('Error generating patient data:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [startDate, endDate]);

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handlePresetChange = (newPreset: DatePreset) => {
    setPreset(newPreset);
    const { start, end } = getDatePresetRange(newPreset);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return {
    dayData,
    summaryData,
    startDate,
    endDate,
    preset,
    isLoading,
    error,
    handleDateRangeChange,
    handlePresetChange,
  };
} 