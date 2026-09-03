import type { jwtPayload } from "../lib/jwt.js";
import type { UserResponse } from "../types/userTypes.js";

export default class UserPolicy {
    static viewAny(user: jwtPayload): boolean {
        return user.role === "ADMIN";
    }
    static view(user: jwtPayload, owner: UserResponse): boolean {
        if (user.role === "ADMIN") {
            return true;
        }
        return user.userId === owner.id;
    }
    static create(user: jwtPayload): boolean {
        return user.role === "ADMIN";
    }
    static update(user: jwtPayload, owner: UserResponse): boolean {
        if (user.role === "ADMIN") {
            return true;
        }
        return user.userId === owner.id;
    }
    static delete(user: jwtPayload): boolean {
        return user.role === "ADMIN";
    }
}
