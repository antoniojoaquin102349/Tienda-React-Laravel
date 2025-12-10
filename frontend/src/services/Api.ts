/// src/services/Api.ts
export class Api {
  // URL base del backend
  static backendUrl = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";

  // =================================================================
  // MÉTODOS HTTP
  // =================================================================
  static async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>("GET", url);
  }

  static async post<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>("POST", url, body);
  }

  static async put<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", url, body);
  }

  static async remove<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", url);
  }

  // =================================================================
  // REQUEST GENÉRICO
  // =================================================================
  private static async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem("token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (token) headers["Authorization"] = `Bearer ${token}`;

      const cleanPath = url.replace(/^\/+/, "");
      const finalUrl = `${this.backendUrl}/api/${cleanPath}`;

      const response = await fetch(finalUrl, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      let data: T | null = null;
      let error: string | undefined;

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        try {
          const json = await response.json();
          data = json as T;

          // Si el backend devuelve mensaje de error
          if ("message" in json && typeof (json as any).message === "string") {
            error = (json as any).message;
          }
        } catch {
          error = "Respuesta inválida del servidor";
        }
      } else if (!response.ok) {
        error = `Error ${response.status}: ${response.statusText}`;
      }

      return {
        statusCode: response.status,
        data,
        error,
      };
    } catch (err: any) {
      console.error(`[API Error] ${method} ${url}:`, err);
      return {
        statusCode: 0,
        data: null,
        error: err.message || "Error de conexión",
      };
    }
  }
}

// =================================================================
// TIPO DE RESPUESTA
// =================================================================
export interface ApiResponse<T> {
  statusCode: number;
  data: T | null;
  error?: string;
}

export const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};