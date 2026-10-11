import prisma from "../prisma.js";
import type { Prisma } from "@prisma/client";

export async function createLeaveRequest(
    employeeId: string,
    overrides: Partial<Prisma.LeaveRequestCreateInput> = {},
) {
    return prisma.leaveRequest.create({
        data: {
            startDate: new Date("2026-09-01"),
            endDate: new Date("2026-09-03"),
            reason: "Personal leave",
            employee: {
                connect: {
                    id: employeeId,
                },
            },
            ...overrides,
        },
    });
}
