import type { Employee } from "../generated/prisma/index.js";
import type { jwtPayload } from "../lib/jwt.js";
export default class EmployeePolicy {
    static viewAny(user: jwtPayload): boolean;
    static view(user: jwtPayload, employee: Employee): boolean;
    static create(user: jwtPayload): boolean;
    static update(user: jwtPayload, employee: Employee): boolean;
    static delete(user: jwtPayload): boolean;
}
//# sourceMappingURL=employee.policy.d.ts.map
