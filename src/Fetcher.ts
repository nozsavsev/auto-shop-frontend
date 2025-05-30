import { ResponseWrapper } from "./types";

export async function Fetcher<T>(url: string, options?: RequestInit): Promise<ResponseWrapper<T>> {
  try {
    console.log("fetching,", options, url.replace(/([^:]\/)\/+/g, "$1"));
    const response = await fetch(url.replace(/([^:]\/)\/+/g, "$1"), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 404:
          return { error: "NOT_FOUND" } as ResponseWrapper<T>;
        case 400:
          return { error: "BAD_REQUEST" } as ResponseWrapper<T>;
        case 500:
          return { error: "INTERNAL_SERVER_ERROR" } as ResponseWrapper<T>;
        default:
          return { error: "NETWORK_ERROR" } as ResponseWrapper<T>;
      }
    }

    if (response.status === 204) {
      return { data: null } as ResponseWrapper<T>;
    }

    return { data: await response.json() } as ResponseWrapper<T>;
  } catch (error) {
    console.log("error", error);
    if (window.location.pathname !== "/503") {
      window.location.replace("/503");
    }

    return { error: "NETWORK_ERROR" } as ResponseWrapper<T>;
  }
}
