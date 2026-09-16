import apiClient from "./client.ts";
import type {
    CreateEmployeePayload,
    Employee,
    filterGetEmployeesPayload,
    UpdateEmployeePayload
} from "../types/employee.ts";

export async function getEmployees(filters?: filterGetEmployeesPayload): Promise<Employee[]> {
    const response = await apiClient.get("/employees", {params: filters});
    return response.data.data;
}

export async function getEmployeesById(id: string): Promise<Employee> {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data.data;
}

export async function createEmployee(data: CreateEmployeePayload): Promise<Employee> {
    const response = await apiClient.post("/employees", data);
    return response.data.data;
}

export async function updateEmployee(id: string, data: UpdateEmployeePayload): Promise<Employee> {
    const response = await apiClient.patch(`/employees/${id}`, data);
    return response.data.data;
}

export async function deleteEmployee(id: string): Promise<Employee> {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data.data;
}