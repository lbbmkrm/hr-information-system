import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
export declare const validateBody: (
    schema: ZodType,
) => (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validatePathParams: (
    schema: ZodType,
) => (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateQueryParams: (
    schema: ZodType,
) => (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validate.middleware.d.ts.map
