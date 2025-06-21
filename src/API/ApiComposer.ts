import * as AutoShopApi from './AutoShopApi';
import { CarsApi, StatusApi, UsersApi } from './Client';
import { CarsSSRApi, StatusSSRApi, UsersSSRApi } from './SSR';

const dev = process.env.NODE_ENV !== 'production';

export const GetDefaultConfig = () => {
  return new AutoShopApi.Configuration({
    credentials: 'include',
  });
};

export type SSRConfigParameters = {
};

export const SSR_BasePath = dev ? 'http://localhost:5005' : 'http://auto-shop-api:5005';

export const GetSSRDefaultConfig = (params: SSRConfigParameters) => {
  return new AutoShopApi.Configuration({
    credentials: 'include',
    basePath: SSR_BasePath,
    headers: {

    },
  });
};

export type ResponseWrapper<T> = {
  data?: T;
  error?: 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR' | 'NETWORK_ERROR';
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
    if (typeof window !== 'undefined' && window.location.pathname !== "/503") {
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