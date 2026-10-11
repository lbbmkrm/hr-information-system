import { ZodType, ZodError } from "zod";
export const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            req.validatedBody = schema.parse(req.body);
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: err.issues[0]?.message,
                });
            }
            next(err);
        }
    };
};
export const validatePathParams = (schema) => {
    return async (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: err.issues[0]?.message,
                });
            }
            next(err);
        }
    };
};
export const validateQueryParams = (schema) => {
    return async (req, res, next) => {
        try {
            req.validatedQuery = schema.parse(req.query);
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: err.issues[0]?.message,
                });
            }
            next(err);
        }
    };
};
//# sourceMappingURL=validate.middleware.js.map