import UserRepository from "../repositories/user.repository.js";
import UserPolicy from "../policies/user.policy.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
export default class UserService {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    async addUser(user, data) {
        if (!UserPolicy.create(user)) {
            throw new AppError("Anda tidak memiliki izin untuk menambah user", 403);
        }
        const existUser = await this.userRepository.findByEmail(data.email);
        if (existUser) {
            throw new AppError("Email sudah terdaftar. Silakan gunakan email lain", 409);
        }
        const hashedPass = await bcrypt.hash(data.password, 12);
        const newUser = await this.userRepository.create({
            email: data.email,
            password: hashedPass,
        });
        return newUser;
    }
    async getAllUsers(user, filter) {
        if (!UserPolicy.viewAny(user)) {
            throw new AppError("Anda tidak memiliki izin untuk melihat daftar user", 403);
        }
        return this.userRepository.findAll(filter);
    }
    async getUserById(authenticatedUser, id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("User tidak ditemukan", 404);
        }
        if (!UserPolicy.view(authenticatedUser, user)) {
            throw new AppError("Anda tidak memiliki izin untuk melihat data user ini", 403);
        }
        return user;
    }
    async updateUser(authenticatedUser, id, data) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("User tidak ditemukan", 404);
        }
        if (data.role && authenticatedUser.role !== "ADMIN") {
            throw new AppError("Tidak dapat meng-update role.", 403);
        }
        if (!UserPolicy.update(authenticatedUser, user)) {
            throw new AppError("Anda tidak memiliki izin untuk mengubah data user ini", 403);
        }
        return this.userRepository.update(id, data);
    }
    async deleteUser(authenticatedUser, id) {
        if (!UserPolicy.delete(authenticatedUser)) {
            throw new AppError("Anda tidak memiliki izin untuk menghapus user", 403);
        }
        const existUser = await this.userRepository.findById(id);
        if (!existUser) {
            throw new AppError("User tidak ditemukan", 404);
        }
        if (authenticatedUser.userId === id) {
            throw new AppError("Tidak dapat menghapus akun sendiri.", 400);
        }
        await this.userRepository.delete(id);
    }
}
//# sourceMappingURL=user.service.js.map