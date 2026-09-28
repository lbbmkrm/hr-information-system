import type { GetUsersFilter, User } from "../types/user.ts";
import apiClient from "./client.ts";

export async function getUsers(filters?: GetUsersFilter): Promise<User[] | null> {
    const response = await apiClient.get("/users", { params: filters });
    return response.data.data;
}

export async function getUserById(id: string): Promise<User | null> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
}
