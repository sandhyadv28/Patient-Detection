import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DayData } from "../../../components/modals";
import { fetchDetailedData, fetchPatientSummary, fetchPerSlotDetailedData } from "./async-action";
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

interface PerSlotDetailedDay {
  [key: string]: {
    label: string;
    overall: {
      total_entries: number;
      total_detections: number;
      total_undetected: number;
      detection_rate: number;
      undetected_rate: number;
    };
    per_bed: Array<{
      detection_status: boolean;
      imageURL: string | null;
      last_updated: string;
      bed_no: string;
    }>;
  } | undefined;
}

interface PatientState {
  summaryData: SummaryResponse | null;
  dayData: DayData[];
  detailedDayData: DetailedResponse['data'] | null;
  perSlotDetailedData: PerSlotDetailedDay[] | null;
  isLoading: boolean;
  isLoadingDetailed: boolean;
  isPerSlotLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  summaryData: null,
  dayData: [],
  detailedDayData: null,
  perSlotDetailedData: null,
  isLoading: false,
  isLoadingDetailed: false,
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
    setLoadingDetailed: createSetState<'isLoadingDetailed', PatientState>('isLoadingDetailed'),
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
      
      // Handle fetchDetailedData
      .addCase(fetchDetailedData.pending, (state) => {
        state.isLoadingDetailed = true;
        state.error = null;
      })
      .addCase(fetchDetailedData.fulfilled, (state, action) => {
        state.isLoadingDetailed = false;
        state.detailedDayData = action.payload;
        state.error = null;
      })
      .addCase(fetchDetailedData.rejected, (state, action) => {
        state.isLoadingDetailed = false;
        state.error = action.payload as string;
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
  setLoadingDetailed,
  setPerSlotLoading, 
  setError 
} = patientSlice.actions;
export { fetchDetailedData, fetchPatientSummary, fetchPerSlotDetailedData } from "./async-action";
export default patientSlice.reducer;