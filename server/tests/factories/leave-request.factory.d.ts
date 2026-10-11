import type { Prisma } from "../../src/generated/prisma/index.js";
export declare function createLeaveRequest(
    employeeId: string,
    overrides?: Partial<Prisma.LeaveRequestCreateInput>,
): Promise<{
    id: string;
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string | null;
    status: import("../../src/generated/prisma/index.js").$Enums.LeaveStatus;
    reviewedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=leave-request.factory.d.ts.map
