import type { LoginPayload, LoginResponse } from "../types/userTypes.js";
export default class AuthService {
    private userRepository;
    constructor();
    login(data: LoginPayload): Promise<LoginResponse | null>;
}
//# sourceMappingURL=auth.service.d.ts.map
