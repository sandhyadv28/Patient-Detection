import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DayData } from "../../../components/modals";
import { fetchDetailedDrilldownData, fetchPatientSummary, fetchPerSlotDetailedData } from "./async-action";
import { createSetState } from "../../utility";

// Raw API response interfaces
interface SummaryResponse {
  overall_summary: {
    hospital: string;
    hospital_unit: string;
    total_entries: number;
    total_detections: number;
    total_undetected: number;
    detection_rate: number;
    undetected_rate: number;
  };
  daily_breakdown: Array<{
    date: string;
    hospital: string;
    hospital_unit: string;
    total_entries: number;
    total_detections: number;
    total_undetected: number;
    detection_rate: number;
    undetected_rate: number;
  }>;
}

interface DetailedResponse {
  status: string;
  data: Array<{
    slot_one?: {
      label: string;
      overall: {
        total_entries: number;
        total_detections: number;
        total_undetected: number;
        detection_rate: number;
        undetected_rate: number;
      };
    };
    slot_two?: {
      label: string;
      overall: {
        total_entries: number;
        total_detections: number;
        total_undetected: number;
        detection_rate: number;
        undetected_rate: number;
      };
    };
    slot_three?: {
      label: string;
      overall: {
        total_entries: number;
        total_detections: number;
        total_undetected: number;
        detection_rate: number;
        undetected_rate: number;
      };
    };
    slot_four?: {
      label: string;
      overall: {
        total_entries: number;
        total_detections: number;
        total_undetected: number;
        detection_rate: number;
        undetected_rate: number;
      };
    };
    slot_five?: {
      label: string;
      overall: {
        total_entries: number;
        total_detections: number;
        total_undetected: number;
        detection_rate: number;
        undetected_rate: number;
      };
    };
    slot_six?: {
      label: string;
      overall: {
        total_entries: number;
        total_detections: number;
        total_undetected: number;
        detection_rate: number;
        undetected_rate: number;
      };
    };
    slot_seven?: {
      label: string;
      overall: {
        total_entries: number;
        total_detections: number;
        total_undetected: number;
        detection_rate: number;
        undetected_rate: number;
      };
    };
    slot_eight?: {
      label: string;
      overall: {
        total_entries: number;
        total_detections: number;
        total_undetected: number;
        detection_rate: number;
        undetected_rate: number;
      };
    };
  }>;
}

interface PatientState {
  summaryData: SummaryResponse | null;
  dayData: DayData[];
  detailedDayData: DetailedResponse['data'] | null;
  perSlotDetailedData: DayData | null;
  isLoading: boolean;
  isPerSlotLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  summaryData: null,
  dayData: [],
  detailedDayData: null,
  perSlotDetailedData: null,
  isLoading: false,
  isPerSlotLoading: false,
  error: null,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDetailedData: (state) => {
      state.detailedDayData = null;
    },
    clearPerSlotDetailedData: (state) => {
      state.perSlotDetailedData = null;
    },
    setSummaryData: createSetState<'summaryData', PatientState>('summaryData'),
    setDayData: createSetState<'dayData', PatientState>('dayData'),
    setDetailedDayData: createSetState<'detailedDayData', PatientState>('detailedDayData'),
    setPerSlotDetailedData: createSetState<'perSlotDetailedData', PatientState>('perSlotDetailedData'),
    setLoading: createSetState<'isLoading', PatientState>('isLoading'),
    setPerSlotLoading: createSetState<'isPerSlotLoading', PatientState>('isPerSlotLoading'),
    setError: createSetState<'error', PatientState>('error'),
  },
  extraReducers: (builder) => {
    // Handle fetchPatientSummary
    builder
      .addCase(fetchPatientSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summaryData = action.payload;
        state.error = null;
      })
      .addCase(fetchPatientSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch patient summary';
      })
      
      // Handle fetchDetailedDrilldownData
      .addCase(fetchDetailedDrilldownData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDetailedDrilldownData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailedDayData = action.payload;
        state.error = null;
      })
      .addCase(fetchDetailedDrilldownData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch detailed data';
      })
      
      // Handle fetchPerSlotDetailedData
      .addCase(fetchPerSlotDetailedData.pending, (state) => {
        state.isPerSlotLoading = true;
        state.error = null;
      })
      .addCase(fetchPerSlotDetailedData.fulfilled, (state, action) => {
        state.isPerSlotLoading = false;
        state.perSlotDetailedData = action.payload;
        state.error = null;
      })
      .addCase(fetchPerSlotDetailedData.rejected, (state, action) => {
        state.isPerSlotLoading = false;
        state.error = action.error.message || 'Failed to fetch per-slot data';
      });
  },
});

export const { 
  clearError, 
  clearDetailedData, 
  clearPerSlotDetailedData, 
  setSummaryData, 
  setDayData, 
  setDetailedDayData, 
  setPerSlotDetailedData, 
  setLoading, 
  setPerSlotLoading, 
  setError 
} = patientSlice.actions;
export { fetchDetailedDrilldownData, fetchPatientSummary, fetchPerSlotDetailedData } from "./async-action";
export default patientSlice.reducer;