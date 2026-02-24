import {
  SERVER_BASE_URL,
  API_USERNAME,
  API_PASSWORD,
} from "@/lib/config/constants";

function createAuthHeader(): string {
  if (typeof window !== "undefined") {
    return `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`;
  }
  return `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")}`;
}

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Authorization: createAuthHeader(),
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: unknown }> {
  const url = `${SERVER_BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ status: res.status }));
      return { data: null, error: err };
    }
    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return { data: null as T, error: undefined };
    }
    const data = (await res.json()) as T;
    return { data, error: undefined };
  } catch (e) {
    return { data: null, error: e };
  }
}

export const client = {
  GET: <T>(path: string) => request<T>(path, { method: "GET" }),
  POST: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  PUT: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  DELETE: (path: string) => request<unknown>(path, { method: "DELETE" }),
};
