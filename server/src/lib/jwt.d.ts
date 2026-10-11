import { Role } from "../generated/prisma/index.js";
export interface jwtPayload {
    userId: string;
    email: string;
    role: Role;
}
export declare const jwtSignature: (payload: jwtPayload) => string;
//# sourceMappingURL=jwt.d.ts.map
