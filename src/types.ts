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