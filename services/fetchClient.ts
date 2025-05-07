import { NetworkCode } from "@/constants/network";
// import auth, { getAuth } from "@react-native-firebase/auth";
import Constants from "expo-constants";
export const DEFAULT_API_VERSION = "v1";

// Type for pxError which is status, message, and data
export type PxError = {
  status: number;
  message: string;
  data: any;
};

const getFetchHeaders = async (): Promise<Record<string, string>> => {
  // const auth = getAuth();
  // const currentUser = auth.currentUser;
  // if (!currentUser) {
  if (true) {
    // console.warn("No authenticated user found.");
    return {
      "Content-Type": "application/json",
    };
  }

  // const token = await currentUser.getIdToken();
  // return {
  //   "Content-Type": "application/json",
  //   Authorization: `Bearer ${token}`,
  // };
};

const logError = (context: string, details: any) => {
  console.error(`${context}:`, details);
};
const logWarning = (context: string, details: any) => {
  console.warn(`${context}:`, details);
};

const fetchClient = {
  get: async (path: string) => {
    return fetchClient.request("GET", path);
  },

  post: async (path: string, body: any) => {
    return fetchClient.request("POST", path, body);
  },

  put: async (path: string, body: any) => {
    return fetchClient.request("PUT", path, body);
  },

  delete: async (path: string, body?: any) => {
    return fetchClient.request("DELETE", path, body);
  },

  request: async (method: string, path: string, body?: any) => {
    try {
      const apiUrl =
        Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
        process.env.EXPO_PUBLIC_API_URL ||
        "http://localhost:5001/brallyboilerplatebackend/us-central1/webApi";
      // const apiVersion = DEFAULT_API_VERSION;
      const apiVersion = "";
      if (!apiUrl) {
        console.log("apiUrl", apiUrl);
        console.log("environment", Constants.expoConfig?.extra);
        throw new Error(
          "API base URL is not defined. Check EXPO_PUBLIC_API_URL."
        );
      }

      const URL = `${apiUrl}${apiVersion}${path}`;
      console.log(`Requesting ${method}: ${URL}`);

      const headers = await getFetchHeaders();
      const options: RequestInit = {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      };

      const response = await fetch(URL, options);
      const data = await response.json();

      if (response?.status === NetworkCode.OK) {
        return {
          status: response.status,
          message: data?.message || "Success",
          data,
        };
      } else {
        throw {
          path,
          status: response.status,
          message: data?.message || "Request failed",
          data,
        };
      }
    } catch (error: any) {
      if (
        error?.status !== NetworkCode.INTERNAL_SERVER_ERROR &&
        error?.status !== NetworkCode.OK
      ) {
        logWarning(`HTTP ${method} Warning`, { path, error });
      } else {
        logError(`HTTP ${method} Error`, { path, error });
      }
      throw {
        status: error?.status || NetworkCode.INTERNAL_SERVER_ERROR,
        message: `${error.message}`,
        data: error?.data || null,
      };
    }
  },
};

export default fetchClient;
