export type DetailedViewProps = {
  preset: string;
  startDate?: string;
  endDate?: string;
};

export type SlotData = {
  label?: string;
  overall?: {
    total_entries?: number;
    total_detections?: number;
    total_undetected?: number;
    detection_rate?: number;
    undetected_rate?: number
  }
};

export type DayHeaderProps = {
  daysArr: any[];
  activeDay: number;
  selectedDate: string;
  onDayClick: (dayIndex: number) => void;
};

export type TimeSlotCardProps = {
  slotKey: string;
  slotIndex: number;
  slotData: SlotData;
  isExpanded: boolean;
  onToggleExpansion: (timeSlot: string, slotKey: string) => void;
  perSlotDetailedData: any;
  isPerSlotLoading: boolean;
  onViewPhoto: (imageKey: string) => void;
};

export type BedDetailsTableProps = {
  slotKey: string;
  perSlotDetailedData: any;
  isPerSlotLoading: boolean;
  onViewPhoto: (imageKey: string) => void;
};

export type PhotoModalProps = {
  isOpen: boolean;
  photoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
};

export const SLOT_KEYS = [
  'slot_one', 'slot_two', 'slot_three', 'slot_four',
  'slot_five', 'slot_six', 'slot_seven', 'slot_eight',
] as const; 