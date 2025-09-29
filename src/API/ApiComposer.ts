import * as AutoShopApi from "./AutoShopApi";
import { CarsApi, StatusApi, UsersApi } from "./Client";
import { CarsSSRApi, StatusSSRApi, UsersSSRApi } from "./SSR";


export type ENV_CONFIG_Type = {
  API_URL: string;
  API_SSR_URL: string;
}


export const ENV_CONFIG: ENV_CONFIG_Type = {
  API_URL: process.env.API_URL || "http://localhost:5005",
  API_SSR_URL: process.env.API_SSR_URL || "http://localhost:5005",
}



export const GetDefaultConfig = () => {
  return new AutoShopApi.Configuration({
    credentials: "include",
    basePath: ENV_CONFIG.API_URL,
  });
};

export type SSRConfigParameters = {};

export const GetSSRDefaultConfig = (params: SSRConfigParameters) => {
  return new AutoShopApi.Configuration({
    credentials: "include",
    basePath: ENV_CONFIG.API_SSR_URL,
    headers: {},
  });
};

export type ResponseWrapper<T> = {
  data?: T;
  error?: "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NETWORK_ERROR";
};

export const ExecuteApiRequest = async <T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): Promise<ResponseWrapper<Awaited<ReturnType<T>>>> => {
  try {
    const response = await fn(...args);
    return { data: response };
  } catch (error: any) {
    // Handle ResponseError from the generated API client
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 404:
          return { error: "NOT_FOUND" };
        case 400:
          return { error: "BAD_REQUEST" };
        case 500:
          return { error: "INTERNAL_SERVER_ERROR" };
        default:
          return { error: "NETWORK_ERROR" };
      }
    }

    // Handle network errors or other exceptions
    if (typeof window !== "undefined" && window.location.pathname !== "/503") {
      window.location.replace("/503");
    }

    return { error: "NETWORK_ERROR" };
  }
};

export class API {
  public static readonly Client = {
    Cars: new CarsApi(),
    Users: new UsersApi(),
    Status: new StatusApi(),
  };

  public static readonly SSR = {
    Cars: new CarsSSRApi(),
    Users: new UsersSSRApi(),
    Status: new StatusSSRApi(),
  };
}
