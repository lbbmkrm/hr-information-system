import type { Employee } from "@prisma/client";
import type { jwtPayload } from "../lib/jwt.js";

export default class EmployeePolicy {
    static viewAny(user: jwtPayload) {
        return user.role === "ADMIN" || user.role === "HR";
    }
    static view(user: jwtPayload, employee: Employee): boolean {
        if (user.role === "ADMIN" || user.role === "HR") {
            return true;
        }
        return employee.userId === user.userId;
    }
    static create(user: jwtPayload): boolean {
        return user.role === "ADMIN" || user.role === "HR";
    }
    static update(user: jwtPayload, employee: Employee): boolean {
        if (user.role === "ADMIN" || user.role === "HR") {
            return true;
        }
        return employee.userId === user.userId;
    }

    static delete(user: jwtPayload): boolean {
        return user.role === "ADMIN" || user.role === "HR";
    }
}
