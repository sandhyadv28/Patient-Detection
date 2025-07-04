import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSetState } from "../../utility";
import { fetchPatientSummary, fetchDetailedDrilldownData, fetchPerSlotDetailedData } from "./async-action";
import { SummaryData, DayData } from "../../../components/modals";

interface PatientState {
  summaryData: SummaryData[];
  dayData: DayData[];
  detailedDayData: DayData | null;
  perSlotDetailedData: DayData | null;
  isLoading: boolean;
  isPerSlotLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  summaryData: [],
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientSummary.pending, (state) => {
        console.log('=== Redux: fetchPatientSummary.pending ===');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientSummary.fulfilled, (state, action: PayloadAction<SummaryData[]>) => {
        console.log('=== Redux: fetchPatientSummary.fulfilled ===');
        console.log('Received data:', action.payload);
        state.isLoading = false;
        state.summaryData = action.payload;
        state.error = null;
      })
      .addCase(fetchPatientSummary.rejected, (state, action) => {
        console.log('=== Redux: fetchPatientSummary.rejected ===');
        console.error('Redux error:', action.error);
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch patient summary";
      })
      .addCase(fetchDetailedDrilldownData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDetailedDrilldownData.fulfilled, (state, action: PayloadAction<DayData>) => {
        state.isLoading = false;
        state.detailedDayData = action.payload;
        state.dayData = [action.payload];
        state.error = null;
      })
      .addCase(fetchDetailedDrilldownData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch detailed drilldown data";
      })
      .addCase(fetchPerSlotDetailedData.pending, (state) => {
        console.log('=== Redux: fetchPerSlotDetailedData.pending ===');
        state.isPerSlotLoading = true;
        state.error = null;
      })
      .addCase(fetchPerSlotDetailedData.fulfilled, (state, action: PayloadAction<DayData>) => {
        console.log('=== Redux: fetchPerSlotDetailedData.fulfilled ===');
        console.log('Received per-slot data:', action.payload);
        console.log('Records count:', action.payload.records.length);
        state.isPerSlotLoading = false;
        state.perSlotDetailedData = action.payload;
        state.error = null;
      })
      .addCase(fetchPerSlotDetailedData.rejected, (state, action) => {
        console.log('=== Redux: fetchPerSlotDetailedData.rejected ===');
        console.error('Per-slot Redux error:', action.error);
        state.isPerSlotLoading = false;
        state.error = action.error.message || "Failed to fetch per-slot detailed data";
      });
  },
});

export const { clearError, clearDetailedData, clearPerSlotDetailedData } = patientSlice.actions;
export { fetchPatientSummary, fetchDetailedDrilldownData, fetchPerSlotDetailedData } from "./async-action";
export default patientSlice.reducer;