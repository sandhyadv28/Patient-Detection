import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";
  import {
    getRefreshToken,
    getToken,
    setRefreshToken,
    setToken,
  } from "../utils/localStorage.util";
  import { API } from "./index";
import { redirectToLogin } from "../utils/utils";
  // Create a minimal axios instance with only needed configurations
  export const axiosInstance = axios.create({
    // Use an appropriate base URL or fallback to '/api'
    baseURL: import.meta.env.VITE_API_URL || "/api",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  
  // Maintained for backward compatibility but marked as export type
  // to ensure it's tree-shaken in production
  export type AxiosResponseError =
    | { msg: string | null }
    | {
        status: "paramValidation";
        errors: Array<{ field: string; msg: string | null }>;
      }
    | {
        status: "paramValidation";
        invalid_field: {
          errors: Array<{
            field: string;
            msg: string | null;
          }>;
        };
      }
    | {
        status: "invalidResponse";
        errors: {
          message: string | null;
        };
      }
    | {
        status: "unAuthorised";
        errors: {
          message: string | null;
        };
      }
    | {
        status: "paramValidation";
        invalid_fields: {
          errors: Array<{
            field: string;
            msg: string | null;
          }>;
        };
      }
    | {
        status: "dataInvalid";
        errors:
          | [
              {
                field: string;
                msg: string | null;
              }
            ]
          | {
              message: string | null;
            };
      }
    | {
        status: "internalServerError";
        msg: string | null;
      }
    | {
        status: "axiosError";
        msg: string | null;
      }
    | {
        data: {
          geolocation_matches: false;
        };
        msg: string;
      };
  
  // Enhanced request interceptor with auth token handling
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
  
  // Simplified logging functions - only used in development mode
  // These will be tree-shaken in production builds
  const logAxiosErrorResponse = import.meta.env.DEV
    ? (error: AxiosError) => {
        try {
          console.log(
            `%c 🚨 ERROR RESPONSE `,
            "background: red; color: white; font-weight: bold; padding: 4px; border-radius: 4px;"
          );
          console.log(
            `%c ❌ ERROR: ${error.response?.data?.toString() || "Unknown Error"}`,
            "color: #ff5252; font-weight: bold;"
          );
          console.log(
            `%c 🔗 URL: %c ${error.response?.config?.url || "N/A"}`,
            "color: gray; font-weight: bold;",
            "color: #007BFF;"
          );
          console.log(
            `%c 🔢 Status: %c ${error.response?.status || "N/A"}`,
            "color: gray; font-weight: bold;",
            "color: orange;"
          );
        } catch {
          console.error("⚠️ Failed to log Axios error.");
        }
      }
    : () => {}; // No-op in production
  
  const logAxiosResponse = import.meta.env.DEV
    ? (response: AxiosResponse) => {
        try {
          console.log(
            `%c ✅ SUCCESS `,
            "background: green; color: white; font-weight: bold; padding: 4px; border-radius: 4px;"
          );
          console.log(
            `%c 🔗 URL: %c ${response.config.url}`,
            "color: gray; font-weight: bold;",
            "color: #007BFF;"
          );
          console.log(
            `%c 🔢 Status: %c ${response.status}`,
            "color: gray; font-weight: bold;",
            "color: green;"
          );
        } catch {
          console.error("⚠️ Failed to log Axios response.");
        }
      }
    : () => {}; // No-op in production
  
  // Optimized response interceptor with auth error handling
  axiosInstance.interceptors.response.use(
    (response) => {
      logAxiosResponse(response);
      return response;
    },
    async (error: AxiosError) => {
      console.log("🚨 ERROR RESPONSE", error);
      logAxiosErrorResponse(error);
  
      const originalRequest = error.config;
  
      if (error.response?.status === 401 || error.response?.status === 403) {
        //Regenerate token if refresh token is available
        const oldRefreshToken = getRefreshToken();
        if (oldRefreshToken && originalRequest) {
          try {
            const { data } = await API.getNewToken(oldRefreshToken);
            const { token, refreshToken } = data;
            
            if (token) {
              setToken(token);
              // Update the original request with the new token
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
  
            if (refreshToken) {
              setRefreshToken(refreshToken);
            }
            // Retry the original request with the new token
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // If token refresh fails, redirect to login
            console.error("Token refresh failed:", refreshError);
            redirectToLogin();
            return Promise.reject(refreshError);
          }
        }
        //If refresh token is not available, redirect to login page
        else {
          redirectToLogin();
          return Promise.reject(error.response?.data || error);
        }
      } else {
        return Promise.reject(error.response?.data || error);
      }
    },
    
  );
  
  // Utility functions for handling response data
  // Marked as pure function for better tree-shaking
  /* @__PURE__ */
  export function composeResponseData<ResponseType>(
    response: AxiosResponse<ResponseType>
  ): {
    status: number;
    data: ResponseType;
  } {
    return {
      status: response.status,
      data: response.data,
    };
  }
  
  // Enum is tree-shakable by default
  export const enum APIResponseStatus {
    Success = "success",
    Failed = "failed",
  }
  
  // Optimized API response helpers with pure annotation for tree-shaking
  /* @__PURE__ */
  function createAPIResponse<TData>(
    type: "success",
    data: TData,
    error: null
  ): { status: "success"; data: TData; error: null };
  function createAPIResponse<TError>(
    type: "error",
    data: null,
    error: TError
  ): { status: "error"; data: null; error: TError };
  function createAPIResponse<TData, TError>(
    type: "success" | "error",
    data: TData,
    error: TError
  ) {
    if (type === "success") {
      return {
        data,
        status: "success",
        error: null,
      };
    }
  
    return {
      data: null,
      status: "error",
      error: error,
    };
  }
  
  // Marked as pure functions for better tree-shaking
  /* @__PURE__ */
  export const APIResponse = {
    success: <TData>(data: TData) =>
      Promise.resolve(createAPIResponse("success", data, null)),
    error: <TError>(error: TError) =>
      Promise.reject(
        createAPIResponse("error", null, error as AxiosResponseError)
      ),
  };
  
  // Optimized helper methods that will be tree-shaken if unused
  /* @__PURE__ */
  export const get = <T>(url: string, config?: any): Promise<T> =>
    axiosInstance
      .get(url, config)
      .then((response: AxiosResponse) => response.data);
  
  /* @__PURE__ */
  export const post = <T>(url: string, data?: any, config?: any): Promise<T> =>
    axiosInstance
      .post(url, data, config)
      .then((response: AxiosResponse) => response.data);
  
  /* @__PURE__ */
  export const put = <T>(url: string, data?: any, config?: any): Promise<T> =>
    axiosInstance
      .put(url, data, config)
      .then((response: AxiosResponse) => response.data);
  
  /* @__PURE__ */
  export const del = <T>(url: string, config?: any): Promise<T> =>
    axiosInstance
      .delete(url, config)
      .then((response: AxiosResponse) => response.data);
  
  export default axiosInstance;
  