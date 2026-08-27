import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import UserRepository from "../repositories/user.repository.js";
import type {
    RegisterUserData,
    UserResponse,
    LoginPayload,
    LoginResponse,
} from "../types/userTypes.js";
import { jwtSignature } from "../lib/jwt.js";

export default class AuthService {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(data: RegisterUserData): Promise<UserResponse | null> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError("Email already exists", 409);
        }

        const hashedPassword: string = await bcrypt.hash(data.password, 12);

        const user = await this.userRepository.create({
            email: data.email,
            password: hashedPassword,
        });

        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }

    async login(data: LoginPayload): Promise<LoginResponse | null> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }
        const isPasswordMatch = await bcrypt.compare(data.password, user.password);
        if (!isPasswordMatch) {
            throw new AppError("Invalid credentials", 401);
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
