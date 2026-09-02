import { describe, expect, it } from "vitest";
import request from "supertest";
import { createId } from "@paralleldrive/cuid2";

import app from "../../src/app.js";
import prisma from "../prisma.js";
import { createUserWithToken } from "../factories/authHelper.js";
import { createEmployee } from "../factories/index.js";
import { createLeaveRequest } from "../factories/index.js";
import { Role, LeaveStatus } from "../../src/generated/prisma/index.js";

describe("Leave Request API", () => {
    describe("POST /api/leave-requests", () => {
        it("should allow employee to create their own leave request", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee({
                user: { connect: { id: user.id } },
            });

            const response = await request(app)
                .post("/api/leave-requests")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    employeeId: employee.id,
                    startDate: "2026-09-01",
                    endDate: "2026-09-03",
                    reason: "Family event",
                });

            expect(response.status).toBe(201);
            expect(response.body.data.status).toBe(LeaveStatus.PENDING);
        });

        it("should allow HR to create a leave request on behalf of another employee", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            const employee = await createEmployee();

            const response = await request(app)
                .post("/api/leave-requests")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    employeeId: employee.id,
                    startDate: "2026-09-01",
                    endDate: "2026-09-03",
                    reason: "Retroactive input",
                });

            expect(response.status).toBe(201);
        });

        it("should reject employee creating a leave request for someone else", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const otherEmployee = await createEmployee();

            const response = await request(app)
                .post("/api/leave-requests")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    employeeId: otherEmployee.id,
                    startDate: "2026-09-01",
                    endDate: "2026-09-03",
                    reason: "Trying to abuse",
                });

            expect(response.status).toBe(403);
        });

        it("should reject when endDate is before or equal to startDate", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee({
                user: { connect: { id: user.id } },
            });

            const response = await request(app)
                .post("/api/leave-requests")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    employeeId: employee.id,
                    startDate: "2026-09-05",
                    endDate: "2026-09-01",
                    reason: "Invalid dates",
                });

            expect(response.status).toBe(400);
        });

        it("should return 404 when employeeId does not exist", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            const fakeEmployeeId = createId();

            const response = await request(app)
                .post("/api/leave-requests")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    employeeId: fakeEmployeeId,
                    startDate: "2026-09-01",
                    endDate: "2026-09-03",
                    reason: "Ghost employee",
                });

            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/leave-requests", () => {
        it("should allow HR to view all leave requests", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            const employee = await createEmployee();
            await createLeaveRequest(employee.id);

            const response = await request(app)
                .get("/api/leave-requests")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it("should reject EMPLOYEE from viewing all leave requests", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });

            const response = await request(app)
                .get("/api/leave-requests")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });

    describe("GET /api/leave-requests/:id", () => {
        it("should allow HR to view any leave request", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            const employee = await createEmployee();
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .get(`/api/leave-requests/${leaveRequest.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it("should allow employee to view their own leave request", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee({
                user: { connect: { id: user.id } },
            });
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .get(`/api/leave-requests/${leaveRequest.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it("should reject employee viewing someone else's leave request", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee();
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .get(`/api/leave-requests/${leaveRequest.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });

    describe("GET /api/leave-requests/employees/:id", () => {
        it("should return leave requests belonging to an employee", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            const employee = await createEmployee();
            await createLeaveRequest(employee.id);

            const response = await request(app)
                .get(`/api/leave-requests/employees/${employee.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe("PATCH /api/leave-requests/:id", () => {
        it("should allow owner to update their own leave request", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee({
                user: { connect: { id: user.id } },
            });
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .patch(`/api/leave-requests/${leaveRequest.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ reason: "Updated reason" });

            expect(response.status).toBe(200);
            expect(response.body.data.reason).toBe("Updated reason");
        });

        it("should reject non-owner from updating a leave request", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee();
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .patch(`/api/leave-requests/${leaveRequest.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ reason: "Trying to edit others" });

            expect(response.status).toBe(403);
        });
    });

    describe("PUT /api/leave-requests/:id/review", () => {
        it("should allow HR to approve someone else's leave request", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            const employee = await createEmployee();
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .put(`/api/leave-requests/${leaveRequest.id}/review`)
                .set("Authorization", `Bearer ${token}`)
                .send({ status: LeaveStatus.APPROVED });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe(LeaveStatus.APPROVED);
        });

        it("should reject HR reviewing their own leave request", async () => {
            const { user, token } = await createUserWithToken({ role: Role.HR });
            const employee = await createEmployee({
                user: { connect: { id: user.id } },
            });
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .put(`/api/leave-requests/${leaveRequest.id}/review`)
                .set("Authorization", `Bearer ${token}`)
                .send({ status: LeaveStatus.APPROVED });

            expect(response.status).toBe(403);
        });

        it("should reject EMPLOYEE from reviewing any leave request", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee();
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .put(`/api/leave-requests/${leaveRequest.id}/review`)
                .set("Authorization", `Bearer ${token}`)
                .send({ status: LeaveStatus.APPROVED });

            expect(response.status).toBe(403);
        });
    });

    describe("DELETE /api/leave-requests/:id", () => {
        it("should allow owner to delete their own leave request", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee({
                user: { connect: { id: user.id } },
            });
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .delete(`/api/leave-requests/${leaveRequest.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);

            const check = await prisma.leaveRequest.findUnique({
                where: { id: leaveRequest.id },
            });
            expect(check).toBeNull();
        });

        it("should reject non-owner from deleting a leave request", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee();
            const leaveRequest = await createLeaveRequest(employee.id);

            const response = await request(app)
                .delete(`/api/leave-requests/${leaveRequest.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });
});