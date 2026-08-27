import z from "zod";
import type { ZodObject } from "zod";
import { LeaveStatus } from "../generated/prisma/index.js";

export const CreateLeaveRequestSchema: ZodObject = z
    .object({
        employeeId: z.cuid2(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        reason: z.string().optional(),
    })
    .check((ctx) => {
        if (ctx.value.endDate <= ctx.value.startDate) {
            ctx.issues.push({
                input: ctx.value.endDate,
                code: "custom",
                message: "End date must greater than start date",
            });
        }
    })
    .strict();

export const UpdateLeaveRequestSchema: ZodObject = z
    .object({
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        reason: z.string().optional(),
    })
    .check((ctx) => {
        if (ctx.value.endDate === undefined || ctx.value.startDate === undefined) return;
        if (ctx.value.endDate <= ctx.value.startDate) {
            ctx.issues.push({
                input: ctx.value.endDate,
                code: "custom",
                message: "End date must greater than start date",
            });
        }
    })
    .strip();

export const UpdateStatusLeaveRequestSchema: ZodObject = z
    .object({
        status: z
            .enum([LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.REJECTED])
            .default(LeaveStatus.PENDING),
    })
    .strict();

export const IdParamsSchema = z.object({
    id: z.cuid2(),
});

export const QueryParamsSchema: ZodObject = z
    .object({
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    })
    .check((ctx) => {
        if (ctx.value.endDate === undefined || ctx.value.startDate === undefined) return;
        if (ctx.value.endDate <= ctx.value.startDate) {
            ctx.issues.push({
                input: ctx.value.endDate,
                code: "custom",
                message: "End date must greater than start date",
            });
        }
    });
