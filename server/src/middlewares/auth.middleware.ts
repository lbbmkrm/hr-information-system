import jwt from "jsonwebtoken";
import config from "../config/index.js";
import type { Request, Response, NextFunction } from "express";
import type { jwtPayload } from "../lib/jwt.js";
import AppError from "../utils/AppError.js";

interface AuthRequest extends Request {
    user?: jwtPayload;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader: string | undefined = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Unauthorized: authorization header is missing", 401);
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new AppError("Invalid token", 401);
        }
        const decoded = jwt.verify(token, config.jwtSecret as string) as jwtPayload;
        req.user = decoded;
        next();
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            if (e.name === "TokenExpiredError") {
                throw new AppError("Sesi telah berakhir", 401);
            }
            if (e.name === "JsonWebTokenError") {
                throw new AppError("Token tidak valid", 401);
            }
        }

        next(e);
    }
};

export default authMiddleware;
