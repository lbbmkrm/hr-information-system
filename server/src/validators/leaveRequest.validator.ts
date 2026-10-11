import z from "zod";
import type { ZodObject } from "zod";
import { LeaveStatus } from "@prisma/client";

const endDateValidation = (value: { startDate?: Date; endDate?: Date }) => {
    if (value.endDate === undefined || value.startDate === undefined) return;
    if (value.endDate < value.startDate) {
        return {
            message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
            path: ["endDate"] as const,
        };
    }
};

export const CreateLeaveRequestSchema: ZodObject = z
    .object({
        employeeId: z.cuid2("ID karyawan tidak valid"),
        startDate: z.coerce.date("Tanggal mulai tidak valid"),
        endDate: z.coerce.date("Tanggal selesai tidak valid"),
        reason: z.string("Alasan harus berupa teks").optional(),
    })
    .check((ctx) => {
        if (ctx.value.endDate < ctx.value.startDate) {
            ctx.issues.push({
                input: ctx.value.endDate,
                code: "custom",
                message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
                path: ["endDate"],
            });
        }
    })
    .strict();

export const UpdateLeaveRequestSchema: ZodObject = z
    .object({
        startDate: z.coerce.date("Tanggal mulai tidak valid").optional(),
        endDate: z.coerce.date("Tanggal selesai tidak valid").optional(),
        reason: z.string("Alasan harus berupa teks").optional(),
    })
    .check((ctx) => {
        const { startDate, endDate } = ctx.value;
        if (startDate === undefined || endDate === undefined) return;
        if (endDate < startDate) {
            ctx.issues.push({
                input: endDate,
                code: "custom",
                message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
                path: ["endDate"],
            });
        }
    })
    .strip();

export const UpdateStatusLeaveRequestSchema: ZodObject = z
    .object({
        status: z
            .enum(
                [LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.REJECTED],
                "Status harus salah satu dari: PENDING, APPROVED, REJECTED",
            )
            .default(LeaveStatus.PENDING),
    })
    .strict();

export const IdParamsSchema = z.object({
    id: z.cuid2("ID tidak valid"),
});

export const QueryParamsSchema: ZodObject = z
    .object({
        startDate: z.coerce.date("Tanggal mulai tidak valid").optional(),
        endDate: z.coerce.date("Tanggal selesai tidak valid").optional(),
    })
    .check((ctx) => {
        const { startDate, endDate } = ctx.value;
        if (startDate === undefined || endDate === undefined) return;
        if (endDate < startDate) {
            ctx.issues.push({
                input: endDate,
                code: "custom",
                message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
                path: ["endDate"],
            });
        }
    });
