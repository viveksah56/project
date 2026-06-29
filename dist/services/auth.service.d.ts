import type { IUser } from "../models/user.model.js";
import type { IRefreshTokenInput, IResetPasswordInput, IResendOtpInput, IForgotPasswordInput, ILoginInput, IVerifyEmailInput } from "../validations/user.validation.js";
export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface IAuthResult {
    user: IUser;
    tokens: IAuthTokens;
}
declare class AuthService {
    loginWithGoogle(idToken: string): Promise<IAuthResult>;
    login(input: ILoginInput): Promise<IAuthResult>;
    verifyEmail(input: IVerifyEmailInput): Promise<{
        message: string;
    }>;
    resendOtp(input: IResendOtpInput): Promise<{
        message: string;
    }>;
    forgotPassword(input: IForgotPasswordInput): Promise<{
        message: string;
    }>;
    resetPassword(input: IResetPasswordInput): Promise<{
        message: string;
    }>;
    refreshToken(input: IRefreshTokenInput): Promise<IAuthTokens>;
}
declare const authService: AuthService;
export default authService;
//# sourceMappingURL=auth.service.d.ts.map