import { describe, expect, it } from "vitest";
import { LeaveStatus } from "../../src/generated/prisma/index.js";
import { createEmployee } from "./employee.factory.js";
import { createLeaveRequest } from "./leave-request.factory.js";

describe("Leave Request Factory", () => {
    it("should create leave request", async () => {
        const employee = await createEmployee();

        const leaveRequest = await createLeaveRequest(employee.id);

        expect(leaveRequest.id).toBeDefined();
        expect(leaveRequest.employeeId).toBe(employee.id);
        expect(leaveRequest.startDate).toEqual(
            new Date("2026-09-01"),
        );
        expect(leaveRequest.endDate).toEqual(
            new Date("2026-09-03"),
        );
        expect(leaveRequest.reason).toBe("Personal leave");
        expect(leaveRequest.status).toBe(LeaveStatus.PENDING);
        expect(leaveRequest.reviewedBy).toBeNull();
    });

    it("should allow overriding default data", async () => {
        const employee = await createEmployee();

        const leaveRequest = await createLeaveRequest(
            employee.id,
            {
                reason: "Medical leave",
                status: LeaveStatus.APPROVED,
            },
        );

        expect(leaveRequest.reason).toBe("Medical leave");
        expect(leaveRequest.status).toBe(LeaveStatus.APPROVED);
    });
});