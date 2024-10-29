import type { AccessToken, ICachable } from "../types.js";
export default class AccessTokenHelpers {
    static refreshCachedAccessToken(clientId: string, item: AccessToken): Promise<ICachable & AccessToken>;
    static toCachable(item: AccessToken): ICachable & AccessToken;
    static calculateExpiry(item: AccessToken): number;
    private static refreshToken;
    static generateCodeVerifier(length: number): string;
    static generateCodeChallenge(codeVerifier: string): Promise<string>;
}
