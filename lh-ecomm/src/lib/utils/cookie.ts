export const setCookie = ({
  name,
  value,
  expires,
  path = '/',
  sameSite = 'Lax'
}: {
  name: string;
  value: string;
  expires?: string;
  path?: string;
  sameSite?: string;
}) => {
  let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;
  
  if (expires) {
      cookieString += `; expires=${expires}`;
  }

  document.cookie = cookieString;
}

export const getCookie = (cname: string): string | null => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieList = decodedCookie.split(';');

  for (const cookie of cookieList) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(name)) {
      return trimmedCookie.substring(name.length);
    }
  }

  return null;
}