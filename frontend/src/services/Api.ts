// src/services/Api.ts
export class Api {
  static backendUrl =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  // =================================================================
  // MÉTODO POST (ya lo tenías)
  // =================================================================
  static async post<T>(
    url: string,
    data: any
  ): Promise<{ statusCode: number; data: T | null }> {
    return this.request<T>("POST", url, data);
  }

  // =================================================================
  // MÉTODO GET (NUEVO - soluciona tu error)
  // =================================================================
  static async get<T>(url: string): Promise<{ statusCode: number; data: T | null }> {
    return this.request<T>("GET", url);
  }

  // =================================================================
  // MÉTODO PRIVADO GENÉRICO (para no repetir código)
  // =================================================================
  private static async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: any
  ): Promise<{ statusCode: number; data: T | null }> {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.backendUrl}${url}`, {
        method,
        credentials: "include", // importante para Sanctum con cookies
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      let data: T | null = null;

      // Solo intentamos parsear JSON si hay contenido
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
        } catch {
          // JSON inválido → dejamos null
        }
      }

      return {
        statusCode: response.status,
        data,
      };
    } catch (error) {
      console.error(`Error en ${method} ${url}:`, error);
      return {
        statusCode: 0,
        data: null,
      };
    }
  }
}