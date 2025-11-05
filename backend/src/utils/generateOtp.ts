import crypto from "crypto";

export function generateOtp(length = 6) {

    const digits = "0123456789";
    let otp = "";
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const byte = bytes?.[i];
        if (typeof byte === 'number') {
            const index = byte % digits.length;
            otp += digits[index];
        }
    }
    return otp;  
}
