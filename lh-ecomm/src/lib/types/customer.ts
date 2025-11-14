export interface CustomerProfile {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    isLoggedIn: boolean;
    userId: string | null; // TODO: need to separate later 
}

export interface GetCustomerDetailResponse {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    email: string;
    registerMethod: string;
    createdAt: Date;
    isSetPassword?: boolean;
}