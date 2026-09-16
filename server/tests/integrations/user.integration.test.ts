import { describe, expect, it } from "vitest";
import request from "supertest";
import { createId } from "@paralleldrive/cuid2";
import { createEmployee } from "../factories/index.js";

import app from "../../src/app.js";
import prisma from "../prisma.js";
import { createUserWithToken } from "../factories/authHelper.js";
import { Role } from "../../src/generated/prisma/index.js";

describe("User API", () => {
    describe("POST /api/users", () => {
        it("should allow ADMIN to create a new user", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });

            const response = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    email: `new-${crypto.randomUUID()}@test.com`,
                    password: "password123",
                });

            expect(response.status).toBe(201);
            expect(response.body.data.password).toBeUndefined();
        });

        it("should reject EMPLOYEE from creating a new user", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });

            const response = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    email: `new-${crypto.randomUUID()}@test.com`,
                    password: "password123",
                });

            expect(response.status).toBe(403);
        });

        it("should reject duplicate email", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const { user: existingUser } = await createUserWithToken();

            const response = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    email: existingUser.email,
                    password: "password123",
                });

            expect(response.status).toBe(409);
        });

        it("should reject password shorter than 6 characters", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });

            const response = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    email: `new-${crypto.randomUUID()}@test.com`,
                    password: "123",
                });

            expect(response.status).toBe(400);
        });
    });

    describe("GET /api/users", () => {
        it("should allow ADMIN to list all users", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });

            const response = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it("should reject EMPLOYEE from listing all users", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });

            const response = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });

    describe("GET /api/users?unassigned=true", () => {
        it("should return only users without an employee record", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });

            const { user: unassignedUser } = await createUserWithToken();
            const { user: assignedUser } = await createUserWithToken();
            await createEmployee({
                user: { connect: { id: assignedUser.id } },
            });

            const response = await request(app)
                .get("/api/users?unassigned=true")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);

            const resultIds = response.body.data.map((u: { id: string }) => u.id);
            expect(resultIds).toContain(unassignedUser.id);
            expect(resultIds).not.toContain(assignedUser.id);
        });

        it("should reject EMPLOYEE from accessing unassigned users filter", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });

            const response = await request(app)
                .get("/api/users?unassigned=true")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });

    describe("GET /api/users/:id", () => {
        it("should allow ADMIN to view any user", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const { user: target } = await createUserWithToken();

            const response = await request(app)
                .get(`/api/users/${target.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.id).toBe(target.id);
        });

        it("should allow user to view their own data", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });

            const response = await request(app)
                .get(`/api/users/${user.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
        });

        it("should reject user viewing someone else's data", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const { user: otherUser } = await createUserWithToken();

            const response = await request(app)
                .get(`/api/users/${otherUser.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });

        it("should return 404 for non-existent user id", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const fakeId = createId();

            const response = await request(app)
                .get(`/api/users/${fakeId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe("PATCH /api/users/:id", () => {
        it("should allow ADMIN to update any user, including role", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const { user: target } = await createUserWithToken();

            const response = await request(app)
                .patch(`/api/users/${target.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ role: Role.HR });

            expect(response.status).toBe(200);
            expect(response.body.data.role).toBe(Role.HR);
        });

        it("should allow user to update their own data", async () => {
            const { user, token } = await createUserWithToken({ role: Role.EMPLOYEE });

            const response = await request(app)
                .patch(`/api/users/${user.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ email: `updated-${crypto.randomUUID()}@test.com` });

            expect(response.status).toBe(200);
        });

        it("should reject user updating someone else's data", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const { user: otherUser } = await createUserWithToken();

            const response = await request(app)
                .patch(`/api/users/${otherUser.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ email: `hacked-${crypto.randomUUID()}@test.com` });

            expect(response.status).toBe(403);
        });
    });

    describe("DELETE /api/users/:id", () => {
        it("should allow ADMIN to delete a user", async () => {
            const { token } = await createUserWithToken({ role: Role.ADMIN });
            const { user: target } = await createUserWithToken();

            const response = await request(app)
                .delete(`/api/users/${target.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);

            const check = await prisma.user.findUnique({ where: { id: target.id } });
            expect(check).toBeNull();
        });

        it("should reject EMPLOYEE from deleting a user", async () => {
            const { token } = await createUserWithToken({ role: Role.EMPLOYEE });
            const { user: target } = await createUserWithToken();

            const response = await request(app)
                .delete(`/api/users/${target.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
        });
    });
});