import React from 'react';
import { ViewToggleProps, ViewType } from '../modals';

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="mb-4">
      <nav className="flex bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => onViewChange('summary')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
            currentView === 'summary'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Summary View
        </button>
        <button
          onClick={() => onViewChange('drilldown')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
            currentView === 'drilldown'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Detailed Analysis
        </button>
      </nav>
    </div>
  );
} 