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

interface SummaryDataWithHospital extends SummaryData {
  hospital: string;
  hospitalUnit: string;
}

export const fetchPatientSummary = createAsyncThunk(
  "patient/fetchPatientSummary",
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { dispatch }) => {
    try {
      // Convert dates to ISO format with specific time (9:04 PM IST = 15:34:07 UTC) for API compatibility
      const startDateISO = moment(startDate).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      const endDateISO = moment(endDate).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      
      // Use API service instead of direct fetch
      const response = await API.fetchSummaryData({
        startDate: startDateISO,
        endDate: endDateISO
      }) as ApiResponse;
      
      console.log('API Response:', response);
      
      // Transform the response to match SummaryData[] interface
      let summaryData: SummaryDataWithHospital[] = [];
      
      if (response?.status === 'success' && response.data?.daily_breakdown) {
        summaryData = response.data.daily_breakdown.map((day: DailyBreakdown) => ({
          date: day.date,
          totalBeds: day.total_entries,
          detected: day.total_detections,
          notDetected: day.total_undetected,
          ambiguous: 0, // API doesn't provide ambiguous data
          detectedPercentage: Math.round(day.detection_rate),
          notDetectedPercentage: Math.round(day.undetected_rate),
          ambiguousPercentage: 0, // API doesn't provide ambiguous data
          hospital: day.hospital,
          hospitalUnit: day.hospital_unit
        }));
      } else {
        console.warn('Unexpected API response format:', response);
        summaryData = [];
      }
      
      console.log('Transformed data:', summaryData);
      return summaryData;
      
    } catch (error) {
      console.error('API Call Error:', error);
      const errorMessage = error instanceof TypeError && error.message.includes('fetch')
        ? 'Network error: Unable to connect to the API server. Please check your internet connection.'
        : error instanceof Error 
          ? error.message 
          : 'Failed to fetch patient summary';
      
      throw new Error(errorMessage);
    }
  }
);

export const fetchDetailedDrilldownData = createAsyncThunk(
  "patient/fetchDetailedDrilldownData",
  async (date?: string) => {
    try {
      // Use provided date or default to today's date
      const targetDate = date || moment().format('YYYY-MM-DD');
      
      // Convert date to ISO format with specific time (9:04 PM IST = 15:34:07 UTC) for API compatibility
      const dateISO = moment(targetDate).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      
      console.log('=== Detailed Drilldown API Call ===');
      console.log('Input date:', targetDate);
      console.log('ISO date:', dateISO);
      
      // Build URL using environment configuration
      const url = `${environment.apiUrl}pdd/detailed/overall?req_date=${dateISO}`;
      
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      const data: DetailedDrilldownResponse = await response.json();
      console.log('Detailed API Response data:', data);
      
      // Transform the detailed API response to match DayData interface
      // Create summary records for each time slot based on the overall data
      const records: DetectionRecord[] = [];
      
      if (data.data && data.data.length > 0) {
        const dayData = data.data[0]; // Get the first (and only) day's data
        
        // Process each time slot
        const slots = [
          { key: 'slot_one', data: dayData.slot_one },
          { key: 'slot_two', data: dayData.slot_two },
          { key: 'slot_three', data: dayData.slot_three },
          { key: 'slot_four', data: dayData.slot_four },
          { key: 'slot_five', data: dayData.slot_five },
          { key: 'slot_six', data: dayData.slot_six },
          { key: 'slot_seven', data: dayData.slot_seven },
          { key: 'slot_eight', data: dayData.slot_eight }
        ];
        
        slots.forEach((slotInfo) => {
          const slot = slotInfo.data;
          if (slot && slot.overall && slot.overall.total_entries > 0) {
            console.log(`Processing ${slotInfo.key}:`, slot);
            
            // Create summary records for this time slot
            // Since we don't have individual bed data, we'll create placeholder records
            // based on the overall statistics
            const totalEntries = slot.overall.total_entries;
            const totalDetections = slot.overall.total_detections;
            const totalUndetected = slot.overall.total_undetected;
            
            // Create detected records
            for (let i = 0; i < totalDetections; i++) {
              records.push({
                bedId: i + 1,
                timeSlot: slot.label,
                status: 'Yes',
                photoUrl: '', // No photo URL available in detailed API
              });
            }
            
            // Create undetected records
            for (let i = 0; i < totalUndetected; i++) {
              records.push({
                bedId: totalDetections + i + 1,
                timeSlot: slot.label,
                status: 'No',
                photoUrl: '', // No photo URL available in detailed API
              });
            }
          }
        });
      }
      
      const transformedData: DayData = {
        date: targetDate,
        records: records,
      };
      
      console.log('Transformed detailed data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('=== Detailed API Call Error ===');
      console.error('Error details:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the API server. Please check your internet connection.');
      }
      throw error;
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
      console.log('Per-Slot API Response data:', data);
      
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
