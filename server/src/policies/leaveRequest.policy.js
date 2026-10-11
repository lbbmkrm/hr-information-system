export default class LeaveRequestPolicy {
    static viewAny(user) {
        return user.role === "HR";
    }
    static view(user, leaveRequest) {
        return user.role === "HR" || user.userId === leaveRequest.employee.user?.id;
    }
    static create(user, employee) {
        return user.role === "HR" || user.userId === employee.userId;
    }
    static update(user, leaveRequest) {
        return user.userId === leaveRequest.employee.user?.id;
    }
    static delete(user, leaveRequest) {
        return user.userId === leaveRequest.employee.user?.id;
    }
    static review(user, leaveRequest) {
        return user.role === "HR" && user.userId !== leaveRequest.employee.user?.id;
    }
}
//# sourceMappingURL=leaveRequest.policy.js.map