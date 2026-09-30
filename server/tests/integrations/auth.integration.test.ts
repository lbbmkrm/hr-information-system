import { describe, expect, it, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";

import app from "../../src/app.js";
import prisma from "../prisma.js";

const password = "password123";

describe("Auth API", () => {
    describe("POST /api/auth/login", () => {
        let email: string;

        beforeEach(async () => {
            email = `test-${crypto.randomUUID()}@example.com`;
            const hashedPassword = await bcrypt.hash(password, 12);

            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
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
                message: "Login Berhasil",
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
                    email: `nonexistent-${crypto.randomUUID()}@example.com`,
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