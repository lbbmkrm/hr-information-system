export default class UserPolicy {
    static viewAny(user) {
        return user.role === "ADMIN";
    }
    static view(user, owner) {
        if (user.role === "ADMIN") {
            return true;
        }
        return user.userId === owner.id;
    }
    static create(user) {
        return user.role === "ADMIN";
    }
    static update(user, owner) {
        if (user.role === "ADMIN") {
            return true;
        }
        return user.userId === owner.id;
    }
    static delete(user) {
        return user.role === "ADMIN";
    }
}
//# sourceMappingURL=user.policy.js.map