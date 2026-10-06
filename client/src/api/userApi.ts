import type {
    CreateUserPayload,
    EditUserPayload,
    GetUsersFilter,
    User,
} from "../types/user.ts";
import apiClient from "./client.ts";

export async function getUsers(filters?: GetUsersFilter): Promise<User[]> {
    const response = await apiClient.get("/users", { params: filters });
    return response.data.data;
}

export async function getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
}

export async function createUser(data: CreateUserPayload): Promise<User> {
    const response = await apiClient.post(`/users`, data);
    return response.data.data;
}

export async function editUser(id: string, data: EditUserPayload): Promise<User> {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data.data;
}

export async function deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
}