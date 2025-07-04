import axios from "axios";

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

export const API = {
  fetchSummaryData,
};