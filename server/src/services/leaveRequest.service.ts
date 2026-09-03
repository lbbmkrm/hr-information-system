import LeaveRequestRepository from "../repositories/leaveRequest.repository.js";
import EmployeeRepository from "../repositories/employee.repository.js";
import type { LeaveRequest } from "../generated/prisma/index.js";
import type {
    CreateLeaveRequest,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
    LeaveRequestFilter,
    LeaveRequestResponse,
} from "../types/leavelRequestTypes.js";
import AppError from "../utils/AppError.js";
import EmployeeService from "./employee.service.js";
import dateValidator from "../utils/dateValidator.js";
import type { jwtPayload } from "../lib/jwt.js";
import LeaveRequestPolicy from "../policies/leaveRequest.policy.js";

export default class LeaveRequestService {
    private leaveRequestRepository: LeaveRequestRepository;
    private employeeRepository: EmployeeRepository;
    private employeeService: EmployeeService;
    constructor() {
        this.leaveRequestRepository = new LeaveRequestRepository();
        this.employeeRepository = new EmployeeRepository();
        this.employeeService = new EmployeeService();
    }

    async getAllLeaveRequests(
        user: jwtPayload,
        filter?: LeaveRequestFilter,
    ): Promise<LeaveRequest[]> {
        if (!LeaveRequestPolicy.viewAny(user)) {
            throw new AppError("Unauthorized", 403);
        }
        return this.leaveRequestRepository.findAll(filter);
    }

    async getLeaveRequest(user: jwtPayload, id: string): Promise<LeaveRequestResponse> {
        const leaveRequest = await this.leaveRequestRepository.findById(id);
        if (!leaveRequest) {
            throw new AppError("Leave Request not found", 404);
        }
        if (!LeaveRequestPolicy.view(user, leaveRequest)) {
            throw new AppError("Unauthorized", 403);
        }
        return leaveRequest;
    }

    async getEmployeeLeaveRequest(
        user: jwtPayload,
        id: string,
    ): Promise<LeaveRequestResponse[] | null> {
        await this.employeeService.getEmployeeById(user, id);
        return this.leaveRequestRepository.findByEmployee(id);
    }

    async addLeaveRequest(
        user: jwtPayload,
        data: CreateLeaveRequest,
    ): Promise<LeaveRequestResponse> {
        const employee = await this.employeeRepository.findById(data.employeeId);
        if (!employee) {
            throw new AppError("Employee not found", 404);
        }
        if (!LeaveRequestPolicy.create(user, employee)) {
            throw new AppError("Unauthorized", 403);
        }
        return this.leaveRequestRepository.create(data);
    }

    async updateLeaveRequest(
        user: jwtPayload,
        id: string,
        data: UpdateLeaveRequest,
    ): Promise<LeaveRequest> {
        const oldLeaveRequest = await this.getLeaveRequest(user, id);
        if (data.startDate) {
            await dateValidator(data.startDate, oldLeaveRequest.endDate);
        }
        if (data.endDate) {
            await dateValidator(oldLeaveRequest.startDate, data.endDate);
        }
        if (!LeaveRequestPolicy.update(user, oldLeaveRequest)) {
            throw new AppError("Unauthorized", 403);
        }
        return this.leaveRequestRepository.update(id, data);
    }

    async updateStatusLeaveRequest(
        user: jwtPayload,
        id: string,
        data: UpdateStatusLeaveRequest,
    ): Promise<LeaveRequest> {
        const leaveRequest = await this.getLeaveRequest(user, id);
        if (!LeaveRequestPolicy.review(user, leaveRequest)) {
            throw new AppError("Unauthorized", 403);
        }
        return this.leaveRequestRepository.updateStatus(id, data);
    }

    async deleteLeaveRequest(user: jwtPayload, id: string): Promise<void> {
        const leaveRequest = await this.getLeaveRequest(user, id);
        if (!LeaveRequestPolicy.delete(user, leaveRequest)) {
            throw new AppError("Unauthorized", 403);
        }
        return this.leaveRequestRepository.delete(id);
    }
}
