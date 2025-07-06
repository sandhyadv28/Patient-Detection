import { createAsyncThunk } from "@reduxjs/toolkit";
import moment from 'moment-timezone';
import { DayData, DetectionRecord } from "../../../components/modals";
import { environment } from '../../../environments/environment.staging';
import { API } from '../../../service';
import { API_CONFIG } from '../../../service/url';



interface DetailedDrilldownResponse {
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

interface PerSlotDetailedResponse {
  status: string;
  data: PerSlotDetailedDay[];
}

interface DailyBreakdown {
  date: string;
  hospital: string;
  hospital_unit: string;
  total_entries: number;
  total_detections: number;
  total_undetected: number;
  detection_rate: number;
  undetected_rate: number;
}

interface ApiResponse {
  status: string;
  data: {
    overall_summary: {
      hospital: string;
      hospital_unit: string;
      total_entries: number;
      total_detections: number;
      total_undetected: number;
      detection_rate: number;
      undetected_rate: number;
    };
    daily_breakdown: DailyBreakdown[];
  };
}

interface SummaryData {
  date: string;
  totalBeds: number;
  detected: number;
  notDetected: number;
  ambiguous: number;
  detectedPercentage: number;
  notDetectedPercentage: number;
  ambiguousPercentage: number;
}

export const fetchPatientSummary = createAsyncThunk(
  "patient/fetchPatientSummary",
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      // Convert dates to ISO format with specific time (9:04 PM IST = 15:34:07 UTC) for API compatibility
      const startDateISO = moment(startDate).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      const endDateISO = moment(endDate).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      
      // Use API service instead of direct fetch
      const response = await API.fetchSummaryData({
        startDate: startDateISO,
        endDate: endDateISO
      }) as ApiResponse;
      
      return response.data;
      
    } catch (error) {
      const errorMessage = error instanceof TypeError && error.message.includes('fetch')
        ? 'Network error: Unable to connect to the API server. Please check your internet connection.'
        : error instanceof Error 
          ? error.message 
          : 'Failed to fetch patient summary';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDetailedDrilldownData = createAsyncThunk(
  "patient/fetchDetailedDrilldownData",
  async (date: string = moment().format('YYYY-MM-DD'), { rejectWithValue }) => {
    try {
      const dateISO = moment(date).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      
      const response = await API.fetchDetailedData(dateISO);
      return response.data;
      
    } catch (error) {
      console.error('=== Detailed API Error ===');
      console.error('Error details:', error);
      const errorMessage = error instanceof TypeError && error.message.includes('fetch')
        ? 'Network error: Unable to connect to the API server. Please check your internet connection.'
        : error instanceof Error 
          ? error.message 
          : 'Failed to fetch detailed data';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPerSlotDetailedData = createAsyncThunk(
  "patient/fetchPerSlotDetailedData",
  async ({ date, slotKey }: { date: string; slotKey: string }) => {
    try {
      const targetDate = date || moment().format('YYYY-MM-DD');
      const dateISO = moment(targetDate).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      const url = `${environment.apiUrl}pdd/detailed/per-slot?req_date=${dateISO}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      const data: PerSlotDetailedResponse = await response.json();
      
      // Find the slot data for the requested slotKey
      let slotData = null;
      if (data.data && data.data.length > 0) {
        const dayData = data.data[0];
        slotData = dayData[slotKey];
      }
      const records: DetectionRecord[] = [];
      if (slotData && slotData.per_bed && Array.isArray(slotData.per_bed)) {
        slotData.per_bed.forEach((bed: {
          detection_status: boolean;
          imageURL: string | null;
          last_updated: string;
          bed_no: string;
  }) => {
          if (bed && bed.bed_no) {
            records.push({
              bedId: parseInt(bed.bed_no),
              timeSlot: slotData.label || 'Unknown Time Slot',
              status: bed.detection_status ? 'Yes' : 'No',
              photoUrl: bed.imageURL || '',
            });
          }
        });
      }
      return {
        date: targetDate,
        records,
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the API server. Please check your internet connection.');
      }
      throw error;
    }
  }
);
