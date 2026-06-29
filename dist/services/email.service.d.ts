interface IEmailOptions {
    to: string;
    subject: string;
    html: string;
}
declare class EmailService {
    private transporter;
    constructor();
    send(options: IEmailOptions): Promise<void>;
    sendOtpEmail(to: string, otp: string): Promise<void>;
    verifyConnection(): Promise<boolean>;
}
declare const emailService: EmailService;
export default emailService;
//# sourceMappingURL=email.service.d.ts.map