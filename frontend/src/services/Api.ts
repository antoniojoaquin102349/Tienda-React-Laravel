export class Api {
    
    static backendUrl = 'http://127.0.0.1:8000/api';
    
    static async post<T>(url: string, data: any): Promise<{ statusCode: number; data: T }> {
        const response = await fetch(`${Api.backendUrl}${url}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        })
        const dataResponse: T = await response.json();
        return {
            statusCode: response.status,
            data: dataResponse,            
        }
    }
}