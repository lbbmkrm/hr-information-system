import LeaveRequestRepository from "../repositories/leaveRequest.repository.js";
import type { LeaveRequest } from "../generated/prisma/index.js";
import type {
    CreateLeaveRequest,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
    LeaveRequestFilter,
} from "../types/leavelRequestTypes.js";
import AppError from "../utils/AppError.js";
import EmployeeService from "./employee.service.js";
import dateValidator from "../utils/dateValidator.js";

export default class LeaveRequestService {
    private leaveRequestRepository: LeaveRequestRepository;
    private employeeService: EmployeeService;
    constructor() {
        this.leaveRequestRepository = new LeaveRequestRepository();
        this.employeeService = new EmployeeService();
    }

    async getAllLeaveRequests(filter?: LeaveRequestFilter): Promise<LeaveRequest[]> {
        return this.leaveRequestRepository.findAll(filter);
    }

    async getLeaveRequest(id: string): Promise<LeaveRequest> {
        const leaveRequest = await this.leaveRequestRepository.findById(id);
        if (!leaveRequest) {
            throw new AppError("Leave Request not found", 404);
        }
        return leaveRequest;
    }

    async getEmployeeLeaveRequest(id: string): Promise<LeaveRequest[] | null> {
        await this.employeeService.getEmployeeById(id);
        return this.leaveRequestRepository.findByEmployee(id);
    }

    async addLeaveRequest(data: CreateLeaveRequest): Promise<LeaveRequest> {
        const leaveRequest = await this.leaveRequestRepository.create(data);
        return leaveRequest;
    }

    async updateLeaveRequest(id: string, data: UpdateLeaveRequest): Promise<LeaveRequest> {
        const oldLeaveRequest = await this.getLeaveRequest(id);
        if (data.startDate) {
            await dateValidator(data.startDate, oldLeaveRequest.endDate);
        }
        if (data.endDate) {
            await dateValidator(oldLeaveRequest.startDate, data.endDate);
        }
        return this.leaveRequestRepository.update(id, data);
    }

    async updateStatusLeaveRequest(
        id: string,
        data: UpdateStatusLeaveRequest,
    ): Promise<LeaveRequest> {
        await this.getLeaveRequest(id);
        return this.leaveRequestRepository.updateStatus(id, data);
    }

    async deleteLeaveRequest(id: string): Promise<void> {
        await this.getLeaveRequest(id);
        return this.leaveRequestRepository.delete(id);
    }
}
