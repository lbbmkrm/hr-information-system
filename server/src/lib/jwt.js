import config from "../config/index.js";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/index.js";
export const jwtSignature = (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: "1d" });
};
//# sourceMappingURL=jwt.js.map