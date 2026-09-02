import { describe, expect, it, beforeEach } from "vitest";
import request from "supertest";
import crypto from "node:crypto";

import app from "../../src/app.js";
import prisma from "../prisma.js";

const uniqueEmail = (): string => {
    return `test-${crypto.randomUUID()}@example.com`;
};

const password = "password123";

describe("Auth API", () => {
    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const email = uniqueEmail();

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email,
                    password,
                });

            expect(response.status).toBe(201);

            expect(response.body).toMatchObject({
                status: "success",
                message: "User registered successfully",
            });

            expect(response.body.data).toBeDefined();
            expect(response.body.data.email).toBe(email);
            expect(response.body.data.role).toBe("EMPLOYEE");

            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            expect(user).not.toBeNull();
            expect(user?.email).toBe(email);
        });

        it("should reject duplicate email", async () => {
            const email = uniqueEmail();

            await request(app)
                .post("/api/auth/register")
                .send({
                    email,
                    password,
                });

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email,
                    password: "password456",
                });

            expect(response.status).toBe(409);

            expect(response.body).toMatchObject({
                status: "error",
            });
        });

        it("should reject invalid email", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "invalid-email",
                    password,
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });

        it("should reject password shorter than minimum length", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: uniqueEmail(),
                    password: "123",
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });

        it("should reject missing email", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    password,
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });

        it("should reject missing password", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: uniqueEmail(),
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });

        it("should not expose password in response", async () => {
            const email = uniqueEmail();

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email,
                    password,
                });

            expect(response.status).toBe(201);

            expect(response.body.data.password).toBeUndefined();
        });

        it("should store hashed password instead of plain password", async () => {
            const email = uniqueEmail();

            await request(app)
                .post("/api/auth/register")
                .send({
                    email,
                    password,
                });

            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            expect(user).not.toBeNull();
            expect(user?.password).not.toBe(password);
        });
    });

    describe("POST /api/auth/login", () => {
        let email: string;

        beforeEach(async () => {
            email = uniqueEmail();

            await request(app)
                .post("/api/auth/register")
                .send({
                    email,
                    password,
                });
        });

        it("should login with valid credentials", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email,
                    password,
                });

            expect(response.status).toBe(200);

            expect(response.body).toMatchObject({
                status: "success",
                message: "User login successfull",
            });

            expect(response.body.data).toBeDefined();
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.token).toBeDefined();

            expect(response.body.data.user.email).toBe(email);
        });

        it("should reject wrong password", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email,
                    password: "wrong-password",
                });

            expect(response.status).toBe(401);
            expect(response.body.status).toBe("error");
        });

        it("should reject non-existent email", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: uniqueEmail(),
                    password,
                });

            expect(response.status).toBe(401);
            expect(response.body.status).toBe("error");
        });

        it("should reject invalid email", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "invalid-email",
                    password,
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });

        it("should reject missing email", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    password,
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });

        it("should reject missing password", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email,
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
        });

        it("should return a JWT token", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email,
                    password,
                });

            expect(response.status).toBe(200);
            expect(typeof response.body.data.token).toBe("string");
            expect(response.body.data.token.length).toBeGreaterThan(0);
        });

        it("should not expose password in login response", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email,
                    password,
                });

            expect(response.status).toBe(200);
            expect(response.body.data.user.password).toBeUndefined();
        });
    });
});
