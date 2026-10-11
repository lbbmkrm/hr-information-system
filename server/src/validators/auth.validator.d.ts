import z from "zod";
export declare const RegisterSchema: z.ZodObject<
    {
        email: z.ZodPreprocess<z.ZodEmail>;
        password: z.ZodString;
    },
    z.core.$strip
>;
export declare const LoginSchema: z.ZodObject<
    {
        email: z.ZodPreprocess<z.ZodEmail>;
        password: z.ZodString;
    },
    z.core.$strip
>;
//# sourceMappingURL=auth.validator.d.ts.map
