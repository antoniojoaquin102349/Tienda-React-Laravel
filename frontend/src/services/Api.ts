export class Api {

    // Api.ts
    static backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    static async post<T>(url: string, data: any): Promise<{ statusCode: number; data: T | null }> {
        try {
            const response = await fetch(`${Api.backendUrl}${url}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            let dataResponse: T | null = null;

            try {
                // Intentamos parsear JSON solo si es válido
                dataResponse = await response.json();
            } catch (e) {
                // Si la respuesta no es JSON (ej: 404 HTML) dejamos null
            }

            return {
                statusCode: response.status,
                data: dataResponse,
            };

        } catch (error) {
            console.error("Error en fetch:", error);
            return {
                statusCode: 0, // indica error de red
                data: null,
            };
        }
    }
}
