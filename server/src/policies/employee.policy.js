export default class EmployeePolicy {
    static viewAny(user) {
        return user.role === "ADMIN" || user.role === "HR";
    }
    static view(user, employee) {
        if (user.role === "ADMIN" || user.role === "HR") {
            return true;
        }
        return employee.userId === user.userId;
    }
    static create(user) {
        return user.role === "ADMIN" || user.role === "HR";
    }
    static update(user, employee) {
        if (user.role === "ADMIN" || user.role === "HR") {
            return true;
        }
        return employee.userId === user.userId;
    }
    static delete(user) {
        return user.role === "ADMIN" || user.role === "HR";
    }
}
//# sourceMappingURL=employee.policy.js.map