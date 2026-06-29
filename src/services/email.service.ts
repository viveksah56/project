import nodemailer, { type Transporter } from "nodemailer";
import { ApiError } from "../utils/AppError.js";
import { renderTemplate } from "../utils/renderTemplate.js";
import { env } from "../config/env.js";

interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  public async send(options: IEmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${env.APP_NAME}" <${env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch {
      throw new ApiError("Failed to send email", 500);
    }
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const otpVerifyUrl = `${env.BASE_URL}/api/v1/auth/verify-email?email=${encodeURIComponent(to)}&otp=${otp}`;
    const otpResendUrl = `${env.BASE_URL}/api/v1/auth/resend-otp?email=${encodeURIComponent(to)}`;

    const html = renderTemplate("otp-verification", {
      otp,
      appName: env.APP_NAME,
      year: new Date().getFullYear().toString(),
      otpLink: otpVerifyUrl,
      resendLink: otpResendUrl,
    });

    await this.send({
      to,
      subject: `${otp} is your ${env.APP_NAME} verification code`,
      html,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}

const emailService = new EmailService();
export default emailService;