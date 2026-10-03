import type { JwtPayload } from "../types/auth.ts";
import { ROLE } from "../types/user.ts";
import type { Employee } from "../types/employee.ts";

export default class EmployeePolicy {
    static viewAny(user: JwtPayload): boolean {
        return user.role === ROLE.ADMIN || user.role === ROLE.HR;
    }
    static view(user: JwtPayload, employee: Employee): boolean {
        if (user.userId === employee.userId) {
            return true;
        }
        return user.role === ROLE.ADMIN || user.role === ROLE.HR;
    }
    static create(user: JwtPayload): boolean {
        return user.role === ROLE.ADMIN || user.role === ROLE.HR;
    }
    static update(user: JwtPayload, employee: Employee): boolean {
        if (user.userId === employee.userId) {
            return true;
        }
        return user.role === ROLE.ADMIN || user.role === ROLE.HR;
    }
    static delete(user: JwtPayload): boolean {
        return user.role === ROLE.ADMIN || user.role === ROLE.HR;
    }
}
