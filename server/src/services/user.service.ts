import UserRepository from "../repositories/user.repository.js";
import type { jwtPayload } from "../lib/jwt.js";
import type {
    CreateUserData,
    GetUsersFilter,
    UpdateUserData,
    UserResponse,
    UsersResponse,
} from "../types/userTypes.js";
import UserPolicy from "../policies/user.policy.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import type { User } from "../generated/prisma/index.js";

export default class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async addUser(user: jwtPayload, data: CreateUserData): Promise<UserResponse> {
        if (!UserPolicy.create(user)) {
            throw new AppError("Anda tidak memiliki izin untuk menambah user", 403);
        }

        const existUser = await this.userRepository.findByEmail(data.email);
        if (existUser) {
            throw new AppError("Email sudah terdaftar. Silakan gunakan email lain", 409);
        }

        const hashedPass: string = await bcrypt.hash(data.password, 12);
        const newUser = await this.userRepository.create({
            email: data.email,
            password: hashedPass,
        });
        return newUser;
    }

    async getAllUsers(user: jwtPayload, filter: GetUsersFilter): Promise<UsersResponse[]> {
        if (!UserPolicy.viewAny(user)) {
            throw new AppError("Anda tidak memiliki izin untuk melihat daftar user", 403);
        }

        return this.userRepository.findAll(filter);
    }

    async getUserById(authenticatedUser: jwtPayload, id: string): Promise<UserResponse> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("User tidak ditemukan", 404);
        }
        if (!UserPolicy.view(authenticatedUser, user)) {
            throw new AppError("Anda tidak memiliki izin untuk melihat data user ini", 403);
        }
        return user;
    }

    async updateUser(
        authenticatedUser: jwtPayload,
        id: string,
        data: UpdateUserData,
    ): Promise<UserResponse | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("User tidak ditemukan", 404);
        }
        if (!UserPolicy.update(authenticatedUser, user)) {
            throw new AppError("Anda tidak memiliki izin untuk mengubah data user ini", 403);
        }
        return this.userRepository.update(id, data);
    }

    async deleteUser(authenticatedUser: jwtPayload, id: string): Promise<void> {
        if (!UserPolicy.delete(authenticatedUser)) {
            throw new AppError("Anda tidak memiliki izin untuk menghapus user", 403);
        }

        const existUser = await this.userRepository.findById(id);
        if (!existUser) {
            throw new AppError("User tidak ditemukan", 404);
        }

        await this.userRepository.delete(id);
    }
}
