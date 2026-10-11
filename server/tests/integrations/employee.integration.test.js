import { describe, expect, it } from "vitest";
import request from "supertest";
import { createId } from "@paralleldrive/cuid2";
import app from "../../src/app.js";
import prisma from "../prisma.js";
import { createUserWithToken } from "../factories/authHelper.js";
import { createEmployee } from "../factories/index.js";
import { Role } from "../../src/generated/prisma/index.js";
describe("Employee API", () => {
    describe("POST /api/employees", () => {
        it("should allow ADMIN to create an employee", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const response = await request(app)
                .post("/api/employees")
                .set("Authorization", `Bearer ${token}`)
                .send({
                name: "Budi Santoso",
                position: "Backend Developer",
                department: "Engineering",
                joinDate: "2026-01-01",
            });
            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe("Budi Santoso");
        });
        it("should reject EMPLOYEE role from creating an employee", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const response = await request(app)
                .post("/api/employees")
                .set("Authorization", `Bearer ${token}`)
                .send({
                name: "Budi Santoso",
                position: "Backend Developer",
                department: "Engineering",
                joinDate: "2026-01-01",
            });
            expect(response.status).toBe(403);
        });
        it("should reject request without token", async () => {
            const response = await request(app)
                .post("/api/employees")
                .send({
                name: "Budi Santoso",
                position: "Backend Developer",
                department: "Engineering",
                joinDate: "2026-01-01",
            });
            expect(response.status).toBe(401);
        });
        it("should reject when required field is missing", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            const response = await request(app)
                .post("/api/employees")
                .set("Authorization", `Bearer ${token}`)
                .send({
                position: "Backend Developer",
                department: "Engineering",
                joinDate: "2026-01-01",
                // name sengaja dihilangkan
            });
            expect(response.status).toBe(400);
        });
    });
    describe("GET /api/employees", () => {
        it("should allow HR to list all employees", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            await createEmployee();
            const response = await request(app)
                .get("/api/employees")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        it("should reject EMPLOYEE role from listing all employees", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const response = await request(app)
                .get("/api/employees")
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
        });
    });
    describe("GET /api/employees/:id", () => {
        it("should allow ADMIN to view any employee", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const employee = await createEmployee();
            const response = await request(app)
                .get(`/api/employees/${employee.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(employee.id);
        });
        it("should allow employee to view their own data", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee({
                user: { connect: { id: user.id } },
            });
            const response = await request(app)
                .get(`/api/employees/${employee.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("should reject employee viewing someone else's data", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const otherEmployee = await createEmployee();
            const response = await request(app)
                .get(`/api/employees/${otherEmployee.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
        });
        it("should return 404 for non-existent employee id", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const fakeId = createId();
            const response = await request(app)
                .get(`/api/employees/${fakeId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(404);
        });
    });
    describe("GET /api/employees/user/:id", () => {
        it("should return employee data by userId", async () => {
            const { user, token } = await createUserWithToken({ role: Role.ADMIN });
            const employee = await createEmployee({ user: { connect: { id: user.id } } });
            const response = await request(app)
                .get(`/api/employees/user/${user.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("should return 404 when userId has no employee", async () => {
            const { user, token } = await createUserWithToken({ role: Role.ADMIN });
            const response = await request(app)
                .get(`/api/employees/user/${user.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(404);
        });
    });
    describe("PATCH /api/employees/:id", () => {
        it("should allow HR to update any employee", async () => {
            const { token } = await createUserWithToken({ role: Role.HR });
            const employee = await createEmployee();
            const response = await request(app)
                .patch(`/api/employees/${employee.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ position: "Senior Backend Developer" });
            expect(response.status).toBe(200);
            expect(response.body.data.position).toBe("Senior Backend Developer");
        });
        it("should allow employee to update their own data", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee({
                user: { connect: { id: user.id } },
            });
            const response = await request(app)
                .patch(`/api/employees/${employee.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ phone: "089999999999" });
            expect(response.status).toBe(200);
        });
        it("should reject employee updating someone else's data", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const otherEmployee = await createEmployee();
            const response = await request(app)
                .patch(`/api/employees/${otherEmployee.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ phone: "089999999999" });
            expect(response.status).toBe(403);
        });
    });
    describe("DELETE /api/employees/:id", () => {
        it("should allow ADMIN to delete an employee", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const employee = await createEmployee();
            const response = await request(app)
                .delete(`/api/employees/${employee.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            const check = await prisma.employee.findUnique({ where: { id: employee.id } });
            expect(check).toBeNull();
        });
        it("should reject EMPLOYEE role from deleting an employee", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const employee = await createEmployee();
            const response = await request(app)
                .delete(`/api/employees/${employee.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
        });
    });
});
//# sourceMappingURL=employee.integration.test.js.map