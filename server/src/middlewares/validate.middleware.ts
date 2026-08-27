import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateBody = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validatedBody = schema.parse(req.body);
            next();
        } catch (err) {
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

export const validatePathParams = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (err) {
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

export const validateQueryParams = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.validatedQuery = schema.parse(req.query);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                console.log(err);
                return res.status(400).json({
                    status: "error",
                    message: err.issues[0]?.message,
                });
            }
            next(err);
        }
    };
};
