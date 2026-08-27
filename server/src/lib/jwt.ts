import config from "../config/index.js";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/index.js";

export interface jwtPayload {
    userId: string;
    email: string;
    role: Role;
}

export const jwtSignature = (payload: jwtPayload): string => {
    return jwt.sign(payload, config.jwtSecret as string, { expiresIn: "1d" });
};
