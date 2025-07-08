import {DATE_FORMAT_OPTIONS } from './constants';
import moment from 'moment-timezone';

// Enhanced data generation with more realistic patterns


export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
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