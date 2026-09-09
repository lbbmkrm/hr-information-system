import apiClient from "./client.ts";

export interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    joinDate: string;
    phone?: string;
    userId?: string;
}

export async function getEmployees(): Promise<Employee[]> {
    const response = await apiClient.get("/employees");
    return response.data.data;
}
