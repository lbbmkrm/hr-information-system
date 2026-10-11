import prisma from "../prisma.js";
export async function createLeaveRequest(employeeId, overrides = {}) {
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
//# sourceMappingURL=leave-request.factory.js.map