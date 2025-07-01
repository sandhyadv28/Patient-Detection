import React from 'react';
import { Calendar } from 'lucide-react';
import { DatePreset, getDatePresetRange } from '../utils/dataGenerator';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
  preset: DatePreset;
  onPresetChange: (preset: DatePreset) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  preset,
  onPresetChange
}: DateRangePickerProps) {
  const handlePresetClick = (newPreset: DatePreset) => {
    onPresetChange(newPreset);
    if (newPreset !== 'custom') {
      const { start, end } = getDatePresetRange(newPreset);
      onDateRangeChange(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );
    }
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    if (field === 'start') {
      onDateRangeChange(value, endDate);
    } else {
      onDateRangeChange(startDate, value);
    }
    onPresetChange('custom');
  };

  const presetButtons = [
    { key: 'last7' as DatePreset, label: 'Last 7 days' },
    { key: 'last30' as DatePreset, label: 'Last 30 days' },
    { key: 'previousMonth' as DatePreset, label: 'Previous Month' },
    { key: 'custom' as DatePreset, label: 'Custom Range' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="text-blue-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Date Range Selection
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
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
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}