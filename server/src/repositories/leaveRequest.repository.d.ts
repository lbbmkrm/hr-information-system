import type { LeaveRequest } from "../generated/prisma/index.js";
import type {
    CreateLeaveRequest,
    UpdateLeaveRequest,
    UpdateStatusLeaveRequest,
    LeaveRequestFilter,
    LeaveRequestResponse,
} from "../types/leavelRequestTypes.js";
export default class LeaveRequestRepository {
    private RelationsInclude;
    create(data: CreateLeaveRequest): Promise<LeaveRequestResponse>;
    findAll(filter?: LeaveRequestFilter): Promise<LeaveRequestResponse[]>;
    findByEmployee(id: string): Promise<LeaveRequestResponse[] | null>;
    findById(id: string): Promise<LeaveRequestResponse | null>;
    update(id: string, data: UpdateLeaveRequest): Promise<LeaveRequest>;
    updateStatus(id: string, data: UpdateStatusLeaveRequest): Promise<LeaveRequest>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=leaveRequest.repository.d.ts.map
