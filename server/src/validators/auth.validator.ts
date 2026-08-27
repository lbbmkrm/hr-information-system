import z from "zod";

export const RegisterSchema = z.object({
    email: z.preprocess(
        (value) => {
            if (typeof value === "string" && value.trim() === "") {
                return undefined;
            }
            return value;
        },
        z.email({
            error: (issue) =>
                issue.input === undefined ? "email address is required" : "invalid email address",
        }),
    ),
    password: z.string().min(6),
});

export const LoginSchema = z.object({
    email: z.preprocess(
        (value) => {
            if (typeof value === "string" && value.trim() === "") {
                return undefined;
            }
            return value;
        },
        z.email({
            error: (issue) =>
                issue.input === undefined ? "email address is required" : "invalid email address",
        }),
    ),
    password: z.string().min(6),
});
