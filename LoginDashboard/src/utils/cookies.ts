/**
 * Cookie utility for token storage.
 * Stores the JWT token in a browser cookie so it persists across page reloads.
 */

const TOKEN_COOKIE_NAME = "auth_token";

export function setTokenCookie(token: string, days: number = 7): void {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getTokenCookie(): string | null {
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${TOKEN_COOKIE_NAME}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function removeTokenCookie(): void {
    document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
