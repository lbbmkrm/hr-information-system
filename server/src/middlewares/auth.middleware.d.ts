import type { Request, Response, NextFunction } from "express";
import type { jwtPayload } from "../lib/jwt.js";
interface AuthRequest extends Request {
    user?: jwtPayload;
}
declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default authMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map
