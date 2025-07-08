import { Download } from 'lucide-react';
import { DayData, SummaryData } from './modals';

interface ExportButtonProps {
  summaryData: SummaryData[];
  dayData: DayData[];
}

export default function ExportButton({ summaryData, dayData }: ExportButtonProps) {
  const handleExport = () => {
    const exportData = {
      summary: summaryData,
      detailed: dayData,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-detection-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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