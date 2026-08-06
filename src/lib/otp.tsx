import crypto from "node:crypto";

export function generateOTP(length = 6) {
    if (length <= 0) {
        throw new Error('Length must be greater than 0');
    }

    let otp = '';
    for (let i = 0; i < length; i++) {
        // Generates a secure random digit (0–9)
        otp += crypto.randomInt(0, 10);
    }
    return otp;
}