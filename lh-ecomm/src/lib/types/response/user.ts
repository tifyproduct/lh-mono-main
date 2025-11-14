import type { APIResponse } from '$lib/types/response/response';

export type CheckUserSetPasswordResponse = APIResponse<{
    id: string;
    hasSetPassword: boolean;
}>;