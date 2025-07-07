import { Calendar } from 'lucide-react';
import DatePicker from '../_common/DatePicker';
import { useAppDispatch } from '../store/hook';
import { fetchPatientSummary } from '../store/slice/patientSlice';
import { getDatePresetRange } from '../utils/dataGenerator';
import { DateField, DatePreset, DateRangePickerProps, PresetButton } from './modals';

export default function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  preset,
  onPresetChange
}: Readonly<DateRangePickerProps>) {
  const dispatch = useAppDispatch();

  const handlePresetClick = (newPreset: DatePreset) => {
    onPresetChange(newPreset);

    if (newPreset !== 'custom') {
      const { start, end } = getDatePresetRange(newPreset);

      const startDateStr = start.format('YYYY-MM-DD');
      const endDateStr = end.clone().add(1, 'day').format('YYYY-MM-DD');

      onDateRangeChange(startDateStr, endDateStr);
      
      dispatch(fetchPatientSummary({ startDate: startDateStr, endDate: endDateStr }));
    }
  };

  const handleCustomDateChange = (field: DateField, value: string) => {
    
    let newStartDate = startDate;
    let newEndDate = endDate;
    
    if (field === 'start') {
      newStartDate = value;
      onDateRangeChange(value, endDate);
    } else {
      newEndDate = value;
      onDateRangeChange(startDate, value);
    }
    
    onPresetChange('custom');
    
    // If both dates are selected, trigger API call
    if (newStartDate && newEndDate) {
      dispatch(fetchPatientSummary({ startDate: newStartDate, endDate: newEndDate }));
    }
  };

  const presetButtons: PresetButton[] = [
    { key: 'last7', label: 'Last 7 days' },
    { key: 'last30', label: 'Last 30 days' },
    { key: 'previousMonth', label: 'Previous Month' },
    { key: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="text-blue-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Date Range Selection
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-4">
        {presetButtons.map(button => (
          <button
            key={button.key}
            onClick={() => handlePresetClick(button.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              preset === button.key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="flex gap-4 pt-3 border-t border-gray-200">
          <div className="flex-1">
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <DatePicker 
            value={startDate} 
              onChange={(value) => handleCustomDateChange('start', value)}
           />
          </div>
          <div className="flex-1">
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <DatePicker 
              value={endDate}
              onChange={(value) => handleCustomDateChange('end', value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}