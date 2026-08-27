import "express";
import type { jwtPayload } from "../lib/jwt.js";
declare global {
    namespace Express {
        interface Request {
            user?: jwtPayload;
            validatedQuery?: unknown;
            validatedBody?: unknown;
        }
    }
}
