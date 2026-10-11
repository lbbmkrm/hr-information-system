import z from "zod";
import { ZodObject } from "zod";
export const CreateEmployeeSchema = z.object({
    name: z.string().trim().min(1).max(255),
    position: z.string().trim().min(1).max(255),
    department: z.string().trim().min(1).max(255),
    joinDate: z.coerce.date(),
    phone: z.string().trim().min(1).max(255).optional(),
    userId: z.string().trim().min(1).max(255).optional().nullable(),
});
export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();
export const GetEmployeeSchema = z.object({
    department: z.string().trim().min(1).max(255).optional(),
    position: z.string().trim().min(1).max(255).optional(),
    // transform before validation
    joinDate: z.coerce.date().optional(),
});
export const IdParamsSchema = z.object({
    id: z.cuid2(),
});
//# sourceMappingURL=employee.validator.js.map