import type { IUser } from "../models/user.model.js";
import { type IPaginationQuery, type IPaginatedResult } from "../utils/pagination.js";
export interface ICreateUserInput {
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin";
    avatar?: string;
}
export interface IUpdateUserInput {
    name?: string;
    email?: string;
    avatar?: string;
    role?: "user" | "admin";
    isVerified?: boolean;
}
declare class UserService {
    createUser(input: ICreateUserInput): Promise<{
        message: string;
    }>;
    getAllUsers(query: IPaginationQuery): Promise<IPaginatedResult<IUser>>;
    getUserById(id: string): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser>;
    updateUser(id: string, input: IUpdateUserInput): Promise<IUser>;
    deleteUser(id: string): Promise<void>;
}
declare const userService: UserService;
export default userService;
//# sourceMappingURL=user.service.d.ts.map