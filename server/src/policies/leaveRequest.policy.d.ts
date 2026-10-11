import type { jwtPayload } from "../lib/jwt.js";
import type { LeaveRequestResponse } from "../types/leavelRequestTypes.js";
import type { EmployeeResponse } from "../types/employeeTypes.js";
export default class LeaveRequestPolicy {
    static viewAny(user: jwtPayload): boolean;
    static view(user: jwtPayload, leaveRequest: LeaveRequestResponse): boolean;
    static create(user: jwtPayload, employee: EmployeeResponse): boolean;
    static update(user: jwtPayload, leaveRequest: LeaveRequestResponse): boolean;
    static delete(user: jwtPayload, leaveRequest: LeaveRequestResponse): boolean;
    static review(user: jwtPayload, leaveRequest: LeaveRequestResponse): boolean;
}
//# sourceMappingURL=leaveRequest.policy.d.ts.map
