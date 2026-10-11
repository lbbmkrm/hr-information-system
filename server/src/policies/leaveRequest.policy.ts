import type { jwtPayload } from "../lib/jwt.js";
import type { LeaveRequestResponse } from "../types/leaveRequestTypes.js";
import type { EmployeeResponse } from "../types/employeeTypes.js";

export default class LeaveRequestPolicy {
    static viewAny(user: jwtPayload): boolean {
        return user.role === "HR";
    }
    static view(user: jwtPayload, leaveRequest: LeaveRequestResponse): boolean {
        return user.role === "HR" || user.userId === leaveRequest.employee.user?.id;
    }
    static create(user: jwtPayload, employee: EmployeeResponse): boolean {
        return user.role === "HR" || user.userId === employee.userId;
    }
    static update(user: jwtPayload, leaveRequest: LeaveRequestResponse): boolean {
        return user.userId === leaveRequest.employee.user?.id;
    }
    static delete(user: jwtPayload, leaveRequest: LeaveRequestResponse): boolean {
        return user.userId === leaveRequest.employee.user?.id;
    }
    static review(user: jwtPayload, leaveRequest: LeaveRequestResponse): boolean {
        return user.role === "HR" && user.userId !== leaveRequest.employee.user?.id;
    }
}
