// Application constants
export const APP_CONFIG = {
  MAX_DATE_RANGE_DAYS: 365,
  DEFAULT_DATE_PRESET: 'last7' as const,
  TIME_SLOTS: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'] as const,
  ACTIVE_BEDS: [1, 2, 3, 4, 5, 6] as const,
  DETECTION_STATUSES: ['Yes', 'No', 'Ambiguous'] as const,
} as const;

// UI constants
export const UI_CONFIG = {
  LOADING_MESSAGES: {
    PATIENT_DATA: 'Loading patient data...',
    EXPORT: 'Preparing export...',
    AUTH: 'Authenticating...',
  },
  ERROR_MESSAGES: {
    DATA_LOAD_FAILED: 'Failed to load patient data. Please try again.',
    INVALID_DATE_RANGE: 'Invalid date range selected.',
    EXPORT_FAILED: 'Failed to export data. Please try again.',
    AUTH_FAILED: 'Authentication failed. Please try again.',
  },
  SUCCESS_MESSAGES: {
    EXPORT_SUCCESS: 'Data exported successfully!',
    LOGIN_SUCCESS: 'Login successful!',
  },
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  PATIENT_DATA: '/api/patient-data',
  AUTH: '/api/auth',
  EXPORT: '/api/export',
} as const;

// Date formatting options
export const DATE_FORMAT_OPTIONS = {
  DISPLAY: {
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const,
  },
  INPUT: 'YYYY-MM-DD' as const,
} as const; 