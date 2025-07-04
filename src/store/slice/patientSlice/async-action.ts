import { createAsyncThunk } from "@reduxjs/toolkit";
import { DayData, DetectionRecord } from "../../../components/modals";
import moment from 'moment-timezone';
import { environment } from '../../../environments/environment.staging';
import { URLS, API_CONFIG } from '../../../service/url';

interface MockiData {
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
  };
}

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

export const fetchPatientSummary = createAsyncThunk(
  "patient/fetchPatientSummary",
  async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    try {
      // Convert dates to ISO format with specific time (9:04 PM IST = 15:34:07 UTC) for API compatibility
      const startDateISO = moment(startDate).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      const endDateISO = moment(endDate).hour(15).minute(34).second(7).millisecond(0).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      
      console.log('Time conversion:');
      console.log('UTC time sent to API:', { startDateISO, endDateISO });
      console.log('IST time (9:04 PM):', {
        start: moment(startDateISO).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss A'),
        end: moment(endDateISO).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss A')
      });
      
      // Build URL using environment configuration and URL service
      const url = `${environment.apiUrl}pdd/summary?start_date=${startDateISO}&end_date=${endDateISO}`;
      
      console.log('=== API Call Details ===');
      console.log('Input dates:', { startDate, endDate });
      console.log('ISO dates:', { startDateISO, endDateISO });
      console.log('API URL:', url);
      console.log('Environment:', environment);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      const data: MockiData = await response.json();
      console.log('API Response data:', data);
      
      // Transform Mocki data to match SummaryData interface
      const transformedData = data.data.daily_breakdown.map(day => ({
        date: day.date,
        totalBeds: day.total_entries,
        detected: day.total_detections,
        notDetected: day.total_undetected,
        ambiguous: 0, // API doesn't provide ambiguous data
        detectedPercentage: Math.round(day.detection_rate),
        notDetectedPercentage: Math.round(day.undetected_rate),
        ambiguousPercentage: 0, // API doesn't provide ambiguous data
      }));
      
      console.log('Transformed data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('=== API Call Error ===');
      console.error('Error details:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the API server. Please check your internet connection.');
      }
      throw error;
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
      console.log('Environment:', environment);
      
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
