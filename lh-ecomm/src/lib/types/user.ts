export interface User {
    id: string;
    shopifyId?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    password: string;
    method: string;
    acceptMarketing: boolean;
    token?: string;
    createdAt: Date;
    updatedAt: Date;
    isSetPassword?: boolean;
}

export interface UserInput {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    method: string;
    countryCode: 'ID' | 'SG';
    shopifyId?: string;
    token?: string;
}

export interface UserOTP {
    userId: string;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
}

export interface CheckUserSetPasswordInput {
    email: string;
}

export interface CheckUserValidPhoneInput {
    id: string;
    phone: string;
}