import z from "zod";
import { Role } from "../generated/prisma/index.js";

export const CreateUserSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

export const UpdateUserSchema = z.object({
    email: z.email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(Role).optional(),
});

export const IdParamsSchema = z.object({
    id: z.cuid2(),
});

export const GetUsersFilterSchema = z.object({
    role: z.enum(Role).optional(),
    createdAfter: z.coerce.date().optional(),
    createdBefore: z.coerce.date().optional(),
});
