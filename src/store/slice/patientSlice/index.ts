import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSetState } from "../../utility";
import { fetchPatientSummary, fetchDrilldownData, fetchDetailedDrilldownData } from "./async-action";
import { SummaryData, DayData } from "../../../components/modals";

interface PatientState {
  summaryData: SummaryData[];
  dayData: DayData[];
  detailedDayData: DayData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  summaryData: [],
  dayData: [],
  detailedDayData: null,
  isLoading: false,
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
      .addCase(fetchDrilldownData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDrilldownData.fulfilled, (state, action: PayloadAction<DayData[]>) => {
        state.isLoading = false;
        state.dayData = action.payload;
        state.error = null;
      })
      .addCase(fetchDrilldownData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch drilldown data";
      })
      .addCase(fetchDetailedDrilldownData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDetailedDrilldownData.fulfilled, (state, action: PayloadAction<DayData>) => {
        state.isLoading = false;
        state.detailedDayData = action.payload;
        state.error = null;
      })
      .addCase(fetchDetailedDrilldownData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch detailed drilldown data";
      });
  },
});

export const { clearError, clearDetailedData } = patientSlice.actions;
export { fetchPatientSummary, fetchDrilldownData, fetchDetailedDrilldownData } from "./async-action";
export default patientSlice.reducer;