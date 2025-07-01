import { SummaryData, DayData } from '../types';

export function exportToCSV(summaryData: SummaryData[], dayData: DayData[]) {
  // Create summary CSV content
  const summaryHeaders = ['Date', 'Total Beds', '% Detected', '% Not Detected', '% Ambiguous'];
  const summaryRows = summaryData.map(data => [
    data.date,
    data.totalBeds.toString(),
    data.detectedPercentage.toString(),
    data.notDetectedPercentage.toString(),
    data.ambiguousPercentage.toString()
  ]);
  
  const summaryCSV = [summaryHeaders, ...summaryRows]
    .map(row => row.join(','))
    .join('\n');
  
  // Create details CSV content
  const detailsHeaders = ['Date', 'Time Slot', 'Bed ID', 'Detection Status', 'Photo URL'];
  const detailsRows: string[][] = [];
  
  dayData.forEach(day => {
    day.records.forEach(record => {
      detailsRows.push([
        day.date,
        record.timeSlot,
        record.bedId.toString(),
        record.status,
        record.photoUrl
      ]);
    });
  });
  
  const detailsCSV = [detailsHeaders, ...detailsRows]
    .map(row => row.join(','))
    .join('\n');
  
  // Create combined CSV with separators
  const combinedCSV = `SUMMARY DATA\n${summaryCSV}\n\nDETAILS DATA\n${detailsCSV}`;
  
  // Download the file
  const blob = new Blob([combinedCSV], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `patient-detection-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}