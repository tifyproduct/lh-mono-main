export interface AuthFailureMetadata {
    shopifyId?: string | null;
    email?: string | null;
    eventAction: 'login' | 'signup' | 'social-login' | 'send-reset-password' | 'manual-activation';
    errorMessage: string;
    ipAddress?: string | null;
    userAgent?: string | null;
}

export interface AuthFailureLog {
    timestamp: Date;
    metadata: AuthFailureMetadata;
}

export interface ShopifyAPIFailureMetadata {
    shopifyId?: string | null;
    email?: string | null;
    shopifyToken?: string | null;
    eventAction: 'customer-create' | 'customer-access-token-create' | 'get-customer-address';
    errorMessage: string;
}

export interface ShopifyAPIFailureLog {
    timestamp: Date;
    metadata: ShopifyAPIFailureMetadata;
}