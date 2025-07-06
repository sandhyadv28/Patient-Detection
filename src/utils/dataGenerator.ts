import { DayData, DetectionRecord, SummaryData, TimeSlotSummary } from '../components/modals';
import { APP_CONFIG, DATE_FORMAT_OPTIONS } from './constants';
import { validateDateRange } from './validation';
import moment from 'moment-timezone';

// Enhanced data generation with more realistic patterns
function generateDetectionStatus(timeSlot: string, bedId: number): 'Yes' | 'No' | 'Ambiguous' {
  // Create more realistic patterns based on time and bed
  const hour = parseInt(timeSlot.replace(/[^0-9]/g, ''));
  const isAM = timeSlot.includes('AM');
  const actualHour = isAM ? hour : (hour === 12 ? 12 : hour + 12);
  
  // Higher detection rates during day hours (6AM-6PM)
  const isDayTime = actualHour >= 6 && actualHour <= 18;
  const baseDetectionRate = isDayTime ? 0.75 : 0.6;
  
  // Add some variation based on bed ID
  const bedVariation = (bedId % 3) * 0.1;
  const finalRate = Math.min(0.95, baseDetectionRate + bedVariation);
  
  const random = Math.random();
  
  if (random < finalRate * 0.8) {
    return 'Yes';
  } else if (random < finalRate) {
    return 'Ambiguous';
  } else {
    return 'No';
  }
}

export function generateDummyData(startDate: Date, endDate: Date): DayData[] {
  const validation = validateDateRange(startDate, endDate);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const data: DayData[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayRecords: DetectionRecord[] = [];
    
    APP_CONFIG.TIME_SLOTS.forEach(timeSlot => {
      APP_CONFIG.ACTIVE_BEDS.forEach(bedId => {
        const status = generateDetectionStatus(timeSlot, bedId);
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
  if (!Array.isArray(dayData) || dayData.length === 0) {
    return [];
  }

  return dayData.map(day => {
    if (!day.records || !Array.isArray(day.records)) {
      throw new Error('Invalid day data structure');
    }

    const totalBeds = APP_CONFIG.ACTIVE_BEDS.length;
    const totalRecords = day.records.length;
    const recordsPerBed = totalRecords / totalBeds;
    
    if (recordsPerBed === 0) {
      throw new Error('No records found for the day');
    }
    
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
  if (!dayData.records || !Array.isArray(dayData.records)) {
    throw new Error('Invalid day data structure');
  }

  return APP_CONFIG.TIME_SLOTS.map(timeSlot => {
    const slotRecords = dayData.records.filter(r => r.timeSlot === timeSlot);
    const totalBeds = APP_CONFIG.ACTIVE_BEDS.length;
    
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
  if (!dateString) {
    return 'Invalid Date';
  }
  
  try {
    // Try to parse the date string using moment for better format handling
    const date = moment(dateString);
    
    if (!date.isValid()) {
      // If moment can't parse it, try with native Date
      const fallbackDate = new Date(dateString);
      if (isNaN(fallbackDate.getTime())) {
        // If both fail, return the original string
        return dateString;
      }
      return fallbackDate.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS.DISPLAY);
    }
    
    return date.format('MMM DD, YYYY');
  } catch (error) {
    console.warn('Date formatting warning:', error, 'Input:', dateString);
    // Return the original string instead of throwing error
    return dateString;
  }
}

export function getDatePresetRange(preset: string): { start: moment.Moment; end: moment.Moment } {
  const today = moment();
  let start: moment.Moment;
  let end: moment.Moment;
  
  switch (preset) {
    case 'last7':
      start = moment().subtract(6, 'days');
      end = moment();
      break;
    case 'last30':
      start = moment().subtract(29, 'days');
      end = moment();
      break;
    case 'previousMonth':
      start = moment().subtract(1, 'month').startOf('month');
      end = moment().subtract(1, 'month').endOf('month');
      break;
    default:
      start = moment().subtract(6, 'days');
      end = moment();
  }
  
  return { start, end };
}