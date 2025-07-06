import axios from "axios";
import { APIResponse, get } from "./axios";
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
  getNewToken
};