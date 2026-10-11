import type { jwtPayload } from "../lib/jwt.js";
import type {
    CreateUserData,
    GetUsersFilter,
    UpdateUserData,
    UserResponse,
    UsersResponse,
} from "../types/userTypes.js";
export default class UserService {
    private userRepository;
    constructor();
    addUser(user: jwtPayload, data: CreateUserData): Promise<UserResponse>;
    getAllUsers(user: jwtPayload, filter: GetUsersFilter): Promise<UsersResponse[]>;
    getUserById(authenticatedUser: jwtPayload, id: string): Promise<UserResponse>;
    updateUser(
        authenticatedUser: jwtPayload,
        id: string,
        data: UpdateUserData,
    ): Promise<UserResponse | null>;
    deleteUser(authenticatedUser: jwtPayload, id: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map
