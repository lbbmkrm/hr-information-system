import apiClient from "./client.ts";
import type {
    LeaveRequest,
    LeaveRequestEditPayload,
    LeaveRequestFilter,
    LeaveRequestPayload,
    LeaveRequestUpdateStatus,
} from "../types/leaveRequest.ts";

export async function getLeaveRequests(filter?: LeaveRequestFilter): Promise<LeaveRequest[]> {
    const response = await apiClient.get(`/leave-requests`, { params: filter });
    return response.data.data;
}

export async function getLeaveRequestByEmployeeId(id: string): Promise<LeaveRequest[]> {
    const response = await apiClient.get(`/leave-requests/employees/${id}`);
    return response.data.data;
}

export async function getLeaveRequestById(id: string): Promise<LeaveRequest> {
    const response = await apiClient.get(`/leave-requests/${id}`);
    return response.data.data;
}

export async function createLeaveRequest(data: LeaveRequestPayload): Promise<LeaveRequest> {
    const response = await apiClient.post(`/leave-requests`, data);
    return response.data.data;
}

export async function editLeaveRequest(
    id: string,
    data: LeaveRequestEditPayload,
): Promise<LeaveRequest> {
    const response = await apiClient.patch(`/leave-requests/${id}`, data);
    return response.data.data;
}

export async function updateLeaveRequestStatus(
    id: string,
    data: LeaveRequestUpdateStatus,
): Promise<LeaveRequest> {
    const response = await apiClient.put(`/leave-requests/${id}/review`, data);
    return response.data.data;
}

export async function deleteLeaveRequest(id: string): Promise<void> {
    return apiClient.delete(`/leave-requests/${id}`);
}
