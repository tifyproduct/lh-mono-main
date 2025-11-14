export interface APIResponse<T> {
    message: string;
    status: number;
    data?: T;
    error?: string;
    systemMessage?: string;
}

export interface APIErrorResponse {
    message?: string;
    status: number;
    error: string;
    systemMessage: string;
}