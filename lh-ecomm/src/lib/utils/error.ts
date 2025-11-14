import { MongoError } from 'mongodb';
import { ErrorCodes, ErrorMessages } from '$lib/constant/errorCode';
import type { APIErrorResponse } from '$lib/types/response/response';


export function getMongoErrorResponse(error: unknown): { code: number; message: string} {
    let code = 500;
    let errorMessage = "An unexpected error occurred.";

    if (error instanceof MongoError) {
        const errCode = error.code;
        if (errCode === 11000) {
            code = 400;
            const fields = Object.keys(error.keyPattern || {});
            if (fields.includes('phone')) {
                errorMessage = "This phone number is already in use. Please enter a different number.";
            } else if (fields.includes('email')) {
                errorMessage = "This email is already in use. Please enter a different email.";
            }
            // add more fields to check for other duplicate key errors here
        }
    } else if (error instanceof Error) {
        code = 400;
        errorMessage = error.message;
    }

    return { code, message: errorMessage };
}

export function generateError(message: string, title?: string): APIErrorResponse {
    switch (message) {
        case ErrorCodes.VALIDATION_ERROR:
            return {
                status: 422,
                error: ErrorMessages.DefaultRequestValidation,
                message: title ? title : ErrorMessages.DefaultRequestValidation,
                systemMessage: ErrorCodes.VALIDATION_ERROR
            }
        case ErrorCodes.EMAIL_NOT_EXISTS:
            return {
                status: 422,
                error: ErrorMessages.EmailNotExists,
                message: title ? title : ErrorMessages.EmailNotExists,
                systemMessage: message
            }
        case ErrorCodes.INVALID_EMAIL_FORMAT:
            return {
                status: 422,
                error: ErrorMessages.InvalidEmailFormat,
                message: title ? title : ErrorMessages.InvalidEmailFormat,
                systemMessage: message
            }
        case ErrorCodes.USER_EMAIL_NOT_FOUND:
            return {
                status: 400,
                error: ErrorMessages.EmailNotFound,
                message: title ? title : ErrorMessages.EmailNotFound,
                systemMessage: message
            }
        case ErrorCodes.INVALID_PASSWORD_FORMAT:
            return {
                status: 422,
                error: ErrorMessages.InvalidPasswordFormat,
                message: title ? title : ErrorMessages.InvalidPasswordFormat,
                systemMessage: message
            }
        case ErrorCodes.PASSWORD_NOT_EXISTS:
            return {
                status: 422,
                error: ErrorMessages.PasswordNotExists,
                message: title ? title : ErrorMessages.PasswordNotExists,
                systemMessage: message
            }
        case ErrorCodes.PASSWORD_MISMATCH:
            return {
                status: 400,
                error: ErrorMessages.PasswordMismatch,
                message: title ? title : ErrorMessages.PasswordMismatch,
                systemMessage: message
            }
        case ErrorCodes.FIRST_NAME_NOT_EXISTS:
            return {
                status: 422,
                error: ErrorMessages.FirstNameRequired,
                message: title ? title : ErrorMessages.FirstNameRequired,
                systemMessage: message
            }
        case ErrorCodes.LAST_NAME_NOT_EXISTS:
            return {
                status: 422,
                error: ErrorMessages.LastNameRequired,
                message: title ? title : ErrorMessages.LastNameRequired,
                systemMessage: message
            }
        case ErrorCodes.PHONE_NUMBER_NOT_EXISTS:
            return {
                status: 422,
                error: ErrorMessages.PhoneNumberRequired,
                message: title ? title : ErrorMessages.PhoneNumberRequired,
                systemMessage: message
            }
        case ErrorCodes.INVALID_PHONE_NUMBER_FORMAT:
            return {
                status: 422,
                error: ErrorMessages.InvalidPhoneFormat,
                message: title ? title : ErrorMessages.InvalidPhoneFormat,
                systemMessage: message
            }
        case ErrorCodes.MISMATCH_COUNTRY_CODE:
            return {
                status: 422,
                error: ErrorMessages.MismatchCountryCode,
                message: title ? title : ErrorMessages.MismatchCountryCode,
                systemMessage: message
            }
        case ErrorCodes.CONFIRM_PASSWORD_NOT_EXISTS:
            return {
                status: 422,
                error: ErrorMessages.ConfirmPasswordRequired,
                message: title ? title : ErrorMessages.ConfirmPasswordRequired,
                systemMessage: message
            }
        case ErrorCodes.MISMATCH_CONFIRM_PASSWORD:
            return {
                status: 422,
                error: ErrorMessages.MismatchConfirmPassword,
                message: title ? title : ErrorMessages.MismatchConfirmPassword,
                systemMessage: message
            }
        case ErrorCodes.EMAIL_ALREADY_EXISTS:
            return {
                status: 400,
                error: ErrorMessages.EmailAlreadyRegistered,
                message: title ? title : ErrorMessages.EmailAlreadyRegistered,
                systemMessage: message
            }
        case ErrorCodes.PHONE_NUMBER_ALREADY_EXISTS:
            return {
                status: 400,
                error: ErrorMessages.PhoneAlreadyRegistered,
                message: title ? title : ErrorMessages.PhoneAlreadyRegistered,
                systemMessage: message
            }
                    
        default:
            return {
                status: 500,
                error: message,
                message: title ? title : ErrorMessages.UnexpectedError,
                systemMessage: ErrorCodes.INTERNAL_SERVER_ERROR
            }
    }
}