// ============================================================================
// CORE DATA TYPES
// ============================================================================

export interface DetectionRecord {
  bedId: number;
  timeSlot: string;
  status: 'Yes' | 'No' | 'Ambiguous';
  photoUrl: string;
}

export interface DayData {
  date: string;
  records: DetectionRecord[];
}

export interface SummaryData {
  date: string;
  totalBeds: number;
  detected: number;
  notDetected: number;
  ambiguous: number;
  detectedPercentage: number;
  notDetectedPercentage: number;
  ambiguousPercentage: number;
}

export interface TimeSlotSummary {
  timeSlot: string;
  totalBeds: number;
  detected: number;
  notDetected: number;
  ambiguous: number;
  detectedPercentage: number;
  notDetectedPercentage: number;
  ambiguousPercentage: number;
  records: DetectionRecord[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export type DatePreset = 'last7' | 'last30' | 'previousMonth' | 'custom';

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
}

// ============================================================================
// LAYOUT COMPONENT TYPES
// ============================================================================

export interface HeaderProps {
  user: User;
  summaryData: SummaryData[];
  dayData: DayData[];
}

export interface FooterProps {
  // Currently no props needed, but keeping for consistency
}

export interface LandingPageProps {
  onLogin: (userData: User) => void;
  showAuthModal: boolean;
  onShowAuthModal: (show: boolean) => void;
}

export interface AnalysisTabsProps {
  currentView: 'summary' | 'detailed';
  onViewChange: (view: 'summary' | 'detailed') => void;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

// ============================================================================
// DATA COMPONENT TYPES
// ============================================================================

export interface SummaryViewProps {
  summaryData: SummaryData[];
}

export interface DetailedViewProps {
  dayData: DayData[];
}

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
  preset: DatePreset;
  onPresetChange: (preset: DatePreset) => void;
}

export interface ExportButtonProps {
  summaryData: SummaryData[];
  dayData: DayData[];
}

export interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UsePatientDataReturn {
  dayData: DayData[];
  summaryData: SummaryData[];
  startDate: string;
  endDate: string;
  preset: DatePreset;
  isLoading: boolean;
  error: string | null;
  handleDateRangeChange: (start: string, end: string) => void;
  handlePresetChange: (newPreset: DatePreset) => void;
}

export interface UseAuthReturn {
  user: User | null;
  showAuthModal: boolean;
  handleLogin: (userData: User) => void;
  handleLogout: () => void;
  setShowAuthModal: (show: boolean) => void;
  isLoading: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PresetButton {
  key: DatePreset;
  label: string;
}

// ============================================================================
// EVENT HANDLER TYPES
// ============================================================================

export type DateField = 'start' | 'end';
export type ViewType = 'summary' | 'detailed';

export interface DateChangeHandler {
  (field: DateField, value: string): void;
}

export interface PresetChangeHandler {
  (preset: DatePreset): void;
}

export interface ViewChangeHandler {
  (view: ViewType): void;
}

export interface LoginHandler {
  (user: User): void;
}

export interface LogoutHandler {
  (): void;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormField {
  name: string;
  value: string;
  type: 'text' | 'email' | 'password' | 'date';
  required?: boolean;
  placeholder?: string;
}

export interface FormState {
  [key: string]: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface AppConfig {
  MAX_DATE_RANGE_DAYS: number;
  DEFAULT_DATE_PRESET: DatePreset;
  TIME_SLOTS: readonly string[];
  ACTIVE_BEDS: readonly number[];
  DETECTION_STATUSES: readonly string[];
}

export interface UiConfig {
  LOADING_MESSAGES: {
    PATIENT_DATA: string;
    EXPORT: string;
    AUTH: string;
  };
  ERROR_MESSAGES: {
    DATA_LOAD_FAILED: string;
    INVALID_DATE_RANGE: string;
    EXPORT_FAILED: string;
    AUTH_FAILED: string;
  };
  SUCCESS_MESSAGES: {
    EXPORT_SUCCESS: string;
    LOGIN_SUCCESS: string;
  };
} 