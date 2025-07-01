import { DayData, DetectionRecord, SummaryData, TimeSlotSummary } from '../types';

const TIME_SLOTS = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'];
const ACTIVE_BEDS = [1, 2, 3, 4, 5, 6];
const DETECTION_STATUSES: Array<'Yes' | 'No' | 'Ambiguous'> = ['Yes', 'No', 'Ambiguous'];

export function generateDummyData(startDate: Date, endDate: Date): DayData[] {
  const data: DayData[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayRecords: DetectionRecord[] = [];
    
    TIME_SLOTS.forEach(timeSlot => {
      ACTIVE_BEDS.forEach(bedId => {
        const status = DETECTION_STATUSES[Math.floor(Math.random() * DETECTION_STATUSES.length)];
        const record: DetectionRecord = {
          bedId,
          timeSlot,
          status,
          photoUrl: `https://dummyimage.com/400x300/e1f5fe/0277bd.png&text=Bed+${bedId}+${timeSlot}`
        };
        dayRecords.push(record);
      });
    });
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      records: dayRecords
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

export function calculateSummaryData(dayData: DayData[]): SummaryData[] {
  return dayData.map(day => {
    const totalBeds = ACTIVE_BEDS.length;
    const totalRecords = day.records.length;
    const recordsPerBed = totalRecords / totalBeds;
    
    const detected = day.records.filter(r => r.status === 'Yes').length / recordsPerBed;
    const notDetected = day.records.filter(r => r.status === 'No').length / recordsPerBed;
    const ambiguous = day.records.filter(r => r.status === 'Ambiguous').length / recordsPerBed;
    
    return {
      date: day.date,
      totalBeds,
      detected: Math.round(detected),
      notDetected: Math.round(notDetected),
      ambiguous: Math.round(ambiguous),
      detectedPercentage: Math.round((detected / totalBeds) * 100),
      notDetectedPercentage: Math.round((notDetected / totalBeds) * 100),
      ambiguousPercentage: Math.round((ambiguous / totalBeds) * 100)
    };
  });
}

export function calculateTimeSlotSummary(dayData: DayData): TimeSlotSummary[] {
  return TIME_SLOTS.map(timeSlot => {
    const slotRecords = dayData.records.filter(r => r.timeSlot === timeSlot);
    const totalBeds = ACTIVE_BEDS.length;
    
    const detected = slotRecords.filter(r => r.status === 'Yes').length;
    const notDetected = slotRecords.filter(r => r.status === 'No').length;
    const ambiguous = slotRecords.filter(r => r.status === 'Ambiguous').length;
    
    return {
      timeSlot,
      totalBeds,
      detected,
      notDetected,
      ambiguous,
      detectedPercentage: Math.round((detected / totalBeds) * 100),
      notDetectedPercentage: Math.round((notDetected / totalBeds) * 100),
      ambiguousPercentage: Math.round((ambiguous / totalBeds) * 100),
      records: slotRecords.sort((a, b) => a.bedId - b.bedId)
    };
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function getDatePresetRange(preset: string): { start: Date; end: Date } {
  const today = new Date();
  const start = new Date();
  const end = new Date(today);
  
  switch (preset) {
    case 'last7':
      start.setDate(today.getDate() - 6);
      break;
    case 'last30':
      start.setDate(today.getDate() - 29);
      break;
    case 'previousMonth':
      start.setMonth(today.getMonth() - 1, 1);
      end.setMonth(today.getMonth(), 0);
      break;
    default:
      start.setDate(today.getDate() - 6);
  }
  
  return { start, end };
}