import type { LeaveRequest } from "../generated/prisma/index.js";
import type {
    CreateLeaveRequest,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
    LeaveRequestFilter,
    LeaveRequestResponse,
} from "../types/leavelRequestTypes.js";
import type { jwtPayload } from "../lib/jwt.js";
export default class LeaveRequestService {
    private leaveRequestRepository;
    private employeeRepository;
    private employeeService;
    constructor();
    getAllLeaveRequests(
        user: jwtPayload,
        filter?: LeaveRequestFilter,
    ): Promise<LeaveRequestResponse[]>;
    getLeaveRequest(user: jwtPayload, id: string): Promise<LeaveRequestResponse>;
    getEmployeeLeaveRequest(user: jwtPayload, id: string): Promise<LeaveRequestResponse[] | null>;
    addLeaveRequest(user: jwtPayload, data: CreateLeaveRequest): Promise<LeaveRequestResponse>;
    updateLeaveRequest(
        user: jwtPayload,
        id: string,
        data: UpdateLeaveRequest,
    ): Promise<LeaveRequest>;
    updateStatusLeaveRequest(
        user: jwtPayload,
        id: string,
        data: UpdateStatusLeaveRequest,
    ): Promise<LeaveRequest>;
    deleteLeaveRequest(user: jwtPayload, id: string): Promise<void>;
}
//# sourceMappingURL=leaveRequest.service.d.ts.map
