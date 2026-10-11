import apiClient from "./client.ts";
import type { DashboardData } from "../types/dashboard.ts";

export async function getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get("/dashboard");
    return response.data.data;
}
