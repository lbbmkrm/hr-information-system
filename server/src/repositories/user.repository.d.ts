import { type User } from "./../generated/prisma/index.js";
import type {
    CreateUserData,
    GetUsersFilter,
    UpdateUserData,
    UsersResponse,
    UserResponse,
} from "../types/userTypes.js";
export default class UserRepository {
    private userReturnFilter;
    create(data: CreateUserData): Promise<UserResponse>;
    findAll(filter?: GetUsersFilter): Promise<UsersResponse[]>;
    findById(id: string): Promise<UserResponse | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, data: UpdateUserData): Promise<UserResponse | null>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map
