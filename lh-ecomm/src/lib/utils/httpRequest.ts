export function getTokenFromRequest(request: Request, tokenName: string): string | null {
    const cookies = request.headers.get('cookie');
    if (!cookies) return null;
    const token = cookies.split('; ').find(row => row.startsWith(`${tokenName}=`))?.split('=')[1];

    return token || null;
}