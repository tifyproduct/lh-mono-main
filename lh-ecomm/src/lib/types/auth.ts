export interface RegisterInput {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    confirmPassword: string;
    store: 'sg' | 'id';
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface CustomerCreateInputShopify {
    acceptsMarketing: boolean;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    // phone: string;
}

export interface CreateAccessTokenInputShopify {
    email: string;
    password: string;
}

export interface GenerateCustomerShopifyDataResult {
    shopifyId?: string;
    token?: string;
}

export interface ResetPasswordInput {
    userId: string;
    password: string;
    confirmPassword: string;
}

export interface CheckUserLastNamePhoneNumberInput {
    userId: string;
    lastName: string;
    phoneNumber: string;
}

export interface ValidateEmailResponse {
    isSocialAccount: boolean;
    hasSetPassword: boolean;
    hasPhoneNumber: boolean;
    isValidPhoneNumber: boolean;
}