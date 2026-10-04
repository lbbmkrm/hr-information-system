import type { JwtPayload } from "../types/auth.ts";
import { ROLE } from "../types/user.ts";
import type { LeaveRequest } from "../types/leaveRequest.ts";
import type { Employee } from "../types/employee.ts";

export default class LeaveRequestPolicy {
    static viewAny(user: JwtPayload): boolean {
        return user.role === ROLE.HR;
    }
    static view(user: JwtPayload, leaveRequest: LeaveRequest): boolean {
        return user.role === ROLE.HR || user.userId === leaveRequest.employee.user?.id;
    }
    static create(user: JwtPayload, employee: Employee): boolean {
        return user.role === ROLE.HR || user.userId === employee.userId;
    }
    static update(user: JwtPayload, leaveRequest: LeaveRequest): boolean {
        return user.userId === leaveRequest.employee.user?.id;
    }
    static delete(user: JwtPayload, leaveRequest: LeaveRequest): boolean {
        return user.userId === leaveRequest.employee.user?.id;
    }
    static review(user: JwtPayload, leaveRequest: LeaveRequest): boolean {
        return user.role === ROLE.HR && user.userId !== leaveRequest.employee.user?.id;
    }
}
