import jwt from "jsonwebtoken";
import config from "../config/index.js";
import AppError from "../utils/AppError.js";
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Unauthorized: authorization header is missing", 401);
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new AppError("Invalid token", 401);
        }
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (e) {
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
//# sourceMappingURL=auth.middleware.js.map