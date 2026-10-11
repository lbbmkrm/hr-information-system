import type { jwtPayload } from "../lib/jwt.js";
import type { UserResponse } from "../types/userTypes.js";
export default class UserPolicy {
    static viewAny(user: jwtPayload): boolean;
    static view(user: jwtPayload, owner: UserResponse): boolean;
    static create(user: jwtPayload): boolean;
    static update(user: jwtPayload, owner: UserResponse): boolean;
    static delete(user: jwtPayload): boolean;
}
//# sourceMappingURL=user.policy.d.ts.map
