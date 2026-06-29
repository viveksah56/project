import { Document, Model } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    avatar?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}
interface IUserModel extends Model<IUser> {
}
declare const User: IUserModel;
export default User;
//# sourceMappingURL=user.model.d.ts.map