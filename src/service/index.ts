import axios from "axios";
import { APIResponse, get } from "./axios";
import { URLS } from "./url";

const BASE_URL = "http://localhost:8000/pdd/summary";

async function fetchSummaryData({ startDate, endDate, hospital, unit, apiKey }: {
  startDate: string,
  endDate: string,
  hospital: string,
  unit: string,
  apiKey: string
}) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      headers: {
        "ai-api-key": apiKey,
        "hospital-name": hospital,
        "hospital-unit": unit,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching summary data:", error);
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
  getNewToken
};