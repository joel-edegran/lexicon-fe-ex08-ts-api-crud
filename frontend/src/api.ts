import type { Car } from './types';

const API_URL: string = "http://localhost:5111/api/cars";

// Helper function to format response status
const formatStatus = (response: Response) => `${response.status} (${response.statusText})`;

// Helper function to log HTTP response status
const logStatus = (response: Response, label: string = ''): void => {
    const prefix: string = label ? `[${label}] ` : '';
    console.log(`${prefix}Status: ${formatStatus(response)}`);
};

// Helper to parse backend response message (string text or JSON)
const getResponseMessage = async (response: Response): Promise<string | null> => {
    try {
        const text: string = (await response.clone().text()).trim();
        if (!text) return null;

        const contentType: string = response.headers.get('content-type') || '';
        if (contentType?.includes('application/json')) {
            try {
                const data: unknown = JSON.parse(text);
                if (typeof data === 'string') return data;
                if (data && typeof data === 'object') {
                    const errorObj = data as Record<string, unknown>;
                    const messageVal = errorObj.message || errorObj.Message || errorObj.title || errorObj.detail;
                    return typeof messageVal === 'string' ? messageVal : text;
                }
            } catch {
                return text;
            }
        }
        return text;
    } catch {
        return null;
    }
};

export const getCars = async (): Promise<Car[]> => {
    const response: Response = await fetch(API_URL);
    logStatus(response, "Read");

    if (!response.ok) {
        const errorMsg: string | null = await getResponseMessage(response);
        throw new Error(errorMsg || `Error fetching cars: ${formatStatus(response)}`);
    }
    const data: Car[] = await response.json()
    return data;
};

export const createCar = async (carData: Omit<Car, 'id'>): Promise<Car> => {
    const response: Response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    });
    logStatus(response, "Create");

    if (!response.ok) {
        const errorMsg: string | null = await getResponseMessage(response);
        throw new Error(errorMsg || `Error creating car: ${formatStatus(response)}`);
    }
    const data: Car = await response.json()
    return data;
};

export const updateCar = async (id: number, carData: Omit<Car, 'id'>): Promise<boolean> => {
    const response: Response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    });
    logStatus(response, "Update");

    if (!response.ok) {
        const errorMsg: string | null = await getResponseMessage(response);
        throw new Error(errorMsg || `Error updating car: ${formatStatus(response)}`);
    }
    return true;
};

export const deleteCar = async (id: number): Promise<string | null> => {
    const response: Response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    logStatus(response, "Delete");

    if (!response.ok) {
        const errorMsg: string | null = await getResponseMessage(response);
        throw new Error(errorMsg || `Error deleting car: ${formatStatus(response)}`);
    }
    const responseMessage: string | null = await getResponseMessage(response);
    return responseMessage;
};