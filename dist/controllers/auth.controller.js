import authService from "../services/auth.service.js";
class AuthController {
    async login(req, res, next) {
        try {
            const result = await authService.login(req.body);
            res.status(200).json({ success: true, message: "Logged in successfully", ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const result = await authService.verifyEmail(req.body);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyEmailFromLink(req, res, next) {
        try {
            const { email, otp } = req.query;
            if (!email || !otp) {
                res.status(400).json({ success: false, message: "Email and OTP are required" });
                return;
            }
            const result = await authService.verifyEmail({ email, otp });
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async resendOtp(req, res, next) {
        try {
            const result = await authService.resendOtp(req.body);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async resendOtpFromLink(req, res, next) {
        try {
            const { email } = req.query;
            if (!email) {
                res.status(400).json({ success: false, message: "Email is required" });
                return;
            }
            const result = await authService.resendOtp({ email });
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const result = await authService.forgotPassword(req.body);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const result = await authService.resetPassword(req.body);
            res.status(200).json({ success: true, ...result });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const tokens = await authService.refreshToken(req.body);
            res.status(200).json({ success: true, ...tokens });
        }
        catch (error) {
            next(error);
        }
    }
}
const authController = new AuthController();
export default authController;
//# sourceMappingURL=auth.controller.js.map