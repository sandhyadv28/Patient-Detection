import {DATE_FORMAT_OPTIONS } from './constants';
import moment from 'moment-timezone';

// Enhanced data generation with more realistic patterns


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