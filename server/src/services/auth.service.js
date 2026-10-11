import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import UserRepository from "../repositories/user.repository.js";
import { jwtSignature } from "../lib/jwt.js";
export default class AuthService {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    async login(data) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError("Email atau password salah", 401);
        }
        const isPasswordMatch = await bcrypt.compare(data.password, user.password);
        if (!isPasswordMatch) {
            throw new AppError("Email atau password salah", 401);
        }
        const token = jwtSignature({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            token: token,
        };
    }
}
//# sourceMappingURL=auth.service.js.map