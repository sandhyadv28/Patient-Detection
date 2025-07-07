import React from 'react';
import { Download } from 'lucide-react';
import { SummaryData, DayData, ExportButtonProps } from './modals';
import { exportToCSV } from '../utils/csvExport';

export default function ExportButton({ summaryData, dayData }: ExportButtonProps) {
  const handleExport = () => {
    // Debug logging to see what data is being exported
    console.log('=== EXPORT BUTTON CLICKED ===');
    console.log('Summary Data:', summaryData);
    console.log('Day Data:', dayData);
    console.log('Summary Data Length:', summaryData?.length || 0);
    console.log('Day Data Length:', dayData?.length || 0);
    
    // Log first few items for detailed inspection
    if (summaryData && summaryData.length > 0) {
      console.log('First Summary Item:', summaryData[0]);
    }
    if (dayData && dayData.length > 0) {
      console.log('First Day Item:', dayData[0]);
      if (dayData[0].records && dayData[0].records.length > 0) {
        console.log('First Record:', dayData[0].records[0]);
      }
    }
    console.log('=== END EXPORT DEBUG ===');
    
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