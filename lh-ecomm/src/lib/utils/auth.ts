import { JWT_SECRET_KEY, JWT_EXPIRY_TIME, COOKIE_AUTH_TOKEN_EXPIRY_DAYS } from '$env/static/private';
import jwt, { type Secret } from 'jsonwebtoken';
import { redirect, type RequestEvent, type Cookies } from '@sveltejs/kit';
import { SHOPIFY_TOKEN_COOKIES_NAME, AUTH_TOKEN_COOKIES_NAME } from '$lib/constants.util';
import { DateTime } from 'luxon';



export interface TokenClaims {
    userId: string;
    // phone: string;
    // email: string;
    // firstName: string;
    // lastName: string;
    shopifyId: string | null;
    shopifyToken: string | null;
}

const SECRET_KEY: Secret = JWT_SECRET_KEY

export function verifyJWTToken(token: string): TokenClaims {
    try {
        const decoded = jwt.verify(
            token,
            SECRET_KEY,
            {algorithms: ['HS512']}
        ) as TokenClaims;

        return decoded
    } catch (err) {
        console.error('JWT verification error:', err);
        if (err instanceof jwt.TokenExpiredError) {
            throw new Error(err.message);
        } else if (err instanceof jwt.JsonWebTokenError) {
            throw new Error(err.message);
        } else {
            throw new Error('Token verification failed');
        }
    }
}

export function generateJWTToken(claims: TokenClaims): string {

    const token = jwt.sign(
        claims, 
        SECRET_KEY,
        {
            expiresIn: JWT_EXPIRY_TIME,
            algorithm: 'HS512'
        }
    )
    return token
}

export function setAuthToken(cookies: Cookies, token: string) {
    cookies.set(AUTH_TOKEN_COOKIES_NAME, token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        expires: DateTime.now().plus({ days: Number(COOKIE_AUTH_TOKEN_EXPIRY_DAYS) }).toJSDate()
    });
}

export function clearShopifyToken(cookies: Cookies) {
    cookies.delete(SHOPIFY_TOKEN_COOKIES_NAME, {
        path: '/'
    });
}

export function handleErrorAuthRedirection(event: RequestEvent) {
	const { store, lang } = event.params;
	const redirectUrl = `/${store ?? 'id'}/${lang ?? 'en'}?404`;
	throw redirect(302, redirectUrl);
}