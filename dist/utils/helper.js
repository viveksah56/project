import crypto from "crypto";
const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CHARSET_LENGTH = CHARSET.length;
const LIMIT = Math.floor(256 / CHARSET_LENGTH) * CHARSET_LENGTH;
export const otpGenerator = (length = 6) => {
    let otp = "";
    while (otp.length < length) {
        const bytes = crypto.randomBytes(length * 2);
        for (let i = 0; i < bytes.length && otp.length < length; i++) {
            const byte = bytes[i];
            if (byte !== undefined && byte < LIMIT) {
                otp += CHARSET[byte % CHARSET_LENGTH];
            }
        }
    }
    return otp;
};
//# sourceMappingURL=helper.js.map