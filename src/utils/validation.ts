import { DatePreset, ValidationResult } from '../components/modals';
import { APP_CONFIG } from './constants';

// Date validation functions
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString);
  return isValidDate(date);
}

export function validateDateRange(startDate: Date, endDate: Date): ValidationResult {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return { isValid: false, error: 'Invalid date range provided' };
  }
  
  if (startDate > endDate) {
    return { isValid: false, error: 'Start date cannot be after end date' };
  }
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > APP_CONFIG.MAX_DATE_RANGE_DAYS) {
    return { 
      isValid: false, 
      error: `Date range cannot exceed ${APP_CONFIG.MAX_DATE_RANGE_DAYS} days` 
    };
  }
  
  return { isValid: true };
}

// Preset validation
export function isValidDatePreset(preset: string): preset is DatePreset {
  return ['last7', 'last30', 'previousMonth', 'custom'].includes(preset);
}

// Data validation functions
export function validateDayData(dayData: any): ValidationResult {
  if (!Array.isArray(dayData)) {
    return { isValid: false, error: 'Day data must be an array' };
  }
  
  for (const day of dayData) {
    if (!day.date || !day.records || !Array.isArray(day.records)) {
      return { isValid: false, error: 'Invalid day data structure' };
    }
    
    if (!isValidDateString(day.date)) {
      return { isValid: false, error: 'Invalid date in day data' };
    }
  }
  
  return { isValid: true };
}

export function validateSummaryData(summaryData: any): ValidationResult {
  if (!Array.isArray(summaryData)) {
    return { isValid: false, error: 'Summary data must be an array' };
  }
  
  for (const summary of summaryData) {
    const requiredFields = ['date', 'totalBeds', 'detected', 'notDetected', 'ambiguous'];
    for (const field of requiredFields) {
      if (typeof summary[field] !== 'number') {
        return { isValid: false, error: `Invalid ${field} field in summary data` };
      }
    }
    
    if (!isValidDateString(summary.date)) {
      return { isValid: false, error: 'Invalid date in summary data' };
    }
  }
  
  return { isValid: true };
}

// User validation
export function validateUser(user: any): ValidationResult {
  if (!user || typeof user !== 'object') {
    return { isValid: false, error: 'User must be an object' };
  }
  
  const requiredFields = ['id', 'name', 'email', 'role'];
  for (const field of requiredFields) {
    if (!user[field] || typeof user[field] !== 'string') {
      return { isValid: false, error: `Invalid ${field} field in user data` };
    }
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
} 