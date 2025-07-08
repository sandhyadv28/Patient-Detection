import { Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dataGenerator';
import { DayHeaderProps } from './types';

export default function DayHeader({ daysArr, activeDay, selectedDate, onDayClick }: DayHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="text-blue-600" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Day-wise Analysis
        </h3>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto mb-4">
        {daysArr.map((day, index) => (
          <button
            key={index}
            onClick={() => onDayClick(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              index === activeDay
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            Day {index + 1}
          </button>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-blue-800 font-medium">
          Selected: {formatDate(selectedDate)}
        </p>
      </div>
    </div>
  );
} 