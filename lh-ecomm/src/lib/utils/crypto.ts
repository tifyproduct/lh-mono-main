import argon2 from 'argon2';
import { randomBytes } from 'crypto';

export async function generateHashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch(e) {
    console.error("failed to hash password: ", e)
    throw new Error("Failed to hash password");
  }
};

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.error('[verifyPassword] error: ', err)
        return false
      }
}

/**
 * Generate a unique 6-digit OTP.
 * @returns {string} A 6-digit OTP.
 */
export function generateOTP(): string {
  const buffer = randomBytes(3);
  const otp = (buffer.readUIntBE(0, 3) % 1000000).toString().padStart(6, '0');
  return otp;
}