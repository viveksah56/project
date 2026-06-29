import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { ApiError } from "../utils/AppError.js";
import { otpGenerator } from "../utils/helper.js";
import { getPaginationParams, buildPaginationMeta, } from "../utils/pagination.js";
import emailService from "./email.service.js";
import bcrypt from "bcryptjs";
class UserService {
    async createUser(input) {
        const existing = await User.findOne({ email: input.email });
        if (existing && existing.isVerified) {
            throw new ApiError("Email already in use", 409);
        }
        if (existing && !existing.isVerified) {
            await User.findByIdAndDelete(existing._id);
        }
        const user = await User.create(input);
        const otp = otpGenerator(6);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const hashedOtp = await bcrypt.hash(otp, 10);
        await Otp.create({ email: user.email, otp: hashedOtp, expiresAt });
        await emailService.sendOtpEmail(user.email, otp);
        return { message: "Registration successful. Please verify your email." };
    }
    async getAllUsers(query) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
        const filter = query.search
            ? {
                $or: [
                    { name: { $regex: query.search, $options: "i" } },
                    { email: { $regex: query.search, $options: "i" } },
                ],
            }
            : {};
        const [data, total] = await Promise.all([
            User.find(filter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter),
        ]);
        return {
            data,
            meta: buildPaginationMeta(total, page, limit),
        };
    }
    async getUserById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        return user;
    }
    async getUserByEmail(email) {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        return user;
    }
    async updateUser(id, input) {
        const user = await User.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        return user;
    }
    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new ApiError("User not found", 404);
        }
    }
}
const userService = new UserService();
export default userService;
//# sourceMappingURL=user.service.js.map