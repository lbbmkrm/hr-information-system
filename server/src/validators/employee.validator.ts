import z from "zod";
import { ZodObject } from "zod";

export const CreateEmployeeSchema: ZodObject = z.object({
    name: z.string().trim().min(1).max(255),
    position: z.string().trim().min(1).max(255),
    department: z.string().trim().min(1).max(255),
    joinDate: z.coerce.date(),
    phone: z.string().trim().min(1).max(255).optional(),
    userId: z.string().trim().min(1).max(255).optional(),
});

export const UpdateEmployeeSchema: ZodObject = CreateEmployeeSchema.partial();

export const GetEmployeeSchema: ZodObject = z.object({
    department: z.string().trim().min(1).max(255).optional(),
    position: z.string().trim().min(1).max(255).optional(),
    // transform before validation
    joinDate: z.coerce.date().optional(),
});

export const IdParamsSchema: ZodObject = z.object({
    id: z.cuid2(),
});
