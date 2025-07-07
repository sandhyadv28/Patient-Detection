import axios from "axios";
import { APIResponse, get, axiosInstance } from "./axios";
import { URLS, API_CONFIG } from "./url";


async function fetchSummaryData({ startDate, endDate }: {
  startDate: string,
  endDate: string
}) {
  try {
    const response = await axios.get(URLS.PATIENT_SUMMARY_API, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      headers: API_CONFIG.HEADERS
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching summary data:", error);
    throw error;
  }
}

async function fetchDetailedData(date: string) {
  try {
    const response = await axios.get(URLS.PATIENT_DETAILED_API, {
      params: {
        req_date: date,
      },
      headers: API_CONFIG.HEADERS
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching detailed data:", error);
    throw error;
  }
}

async function fetchPerSlotData(date: string, slotKey?: string) {
  try {
    const params: any = {
      req_date: date,
    };
    
    if (slotKey && slotKey !== 'all_slots') {
      params.slot_identifier = slotKey;
      params.requested_slot = slotKey;
      params.target_slot = slotKey;
    }
    
    const response = await axios.get(URLS.PATIENT_PER_SLOT_API, {
      params,
      headers: API_CONFIG.HEADERS
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching per-slot data:", error);
    throw error;
  }
}

async function fetchPatientImage(imageKey: string): Promise<string> {
  try {
    const response = await axiosInstance.get(URLS.PATIENT_IMAGE_API, {
      params: {
        image_key: imageKey,
      },
      headers: API_CONFIG.HEADERS,
      responseType: 'json'
    });
    
    if (!response.data.success || !response.data.url) {
      throw new Error('Invalid response from image API: No URL provided');
    }
    
    return response.data.url;
  } catch (error) {
    console.error("Error fetching patient image:", error);
    throw error;
  }
}

async function getNewToken(refreshToken: string | null) {
  if(!refreshToken) {
    return APIResponse.error("Refresh token is required");
  }

  try {
    const data = await get(`${URLS.GET_NEW_TOKEN}?x-refresh-token=${refreshToken}`);
    return APIResponse.success<any>(data);
  } catch (error) {
    console.error("Error while fetching new token", error);
    return APIResponse.error(error);
  }
}

export const API = {
  fetchSummaryData,
  fetchDetailedData,
  fetchPerSlotData,
  fetchPatientImage,
  getNewToken
};