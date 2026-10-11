import type { Prisma } from "../../src/generated/prisma/index.js";
export declare function createEmployee(overrides?: Partial<Prisma.EmployeeCreateInput>): Promise<{
    id: string;
    userId: string | null;
    name: string;
    position: string;
    department: string;
    joinDate: Date;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=employee.factory.d.ts.map
