import React from 'react';
import { Download } from 'lucide-react';
import { SummaryData, DayData, ExportButtonProps } from './modals';
import { exportToCSV } from '../utils/csvExport';

export default function ExportButton({ summaryData, dayData }: ExportButtonProps) {
  const handleExport = () => {
    exportToCSV(summaryData, dayData);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
    >
      <Download size={20} />
      Export CSV
    </button>
  );
}