import z from "zod";
export declare const CreateUserSchema: z.ZodObject<
    {
        email: z.ZodEmail;
        password: z.ZodString;
    },
    z.core.$strip
>;
export declare const UpdateUserSchema: z.ZodObject<
    {
        email: z.ZodOptional<z.ZodEmail>;
        password: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<
            z.ZodEnum<{
                ADMIN: "ADMIN";
                HR: "HR";
                EMPLOYEE: "EMPLOYEE";
            }>
        >;
    },
    z.core.$strip
>;
export declare const IdParamsSchema: z.ZodObject<
    {
        id: z.ZodCUID2;
    },
    z.core.$strip
>;
export declare const GetUsersFilterSchema: z.ZodObject<
    {
        role: z.ZodOptional<
            z.ZodEnum<{
                ADMIN: "ADMIN";
                HR: "HR";
                EMPLOYEE: "EMPLOYEE";
            }>
        >;
        createdAfter: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        createdBefore: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        assigned: z.ZodOptional<z.ZodCodec<z.ZodString, z.ZodBoolean>>;
    },
    z.core.$strip
>;
//# sourceMappingURL=user.validator.d.ts.map
