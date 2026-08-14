import config from "../config/index.js"
import jwt from "jsonwebtoken";

export interface jwtPayload {
    userId: string;
    email: string;
}

export const jwtSignature = (payload: jwtPayload) :string => {
    return jwt.sign(payload, config.jwtSecret as string, {expiresIn: "1d"});
}