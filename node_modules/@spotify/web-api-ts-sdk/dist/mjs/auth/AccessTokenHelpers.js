import { Crypto } from "./Crypto.js";
export default class AccessTokenHelpers {
    static async refreshCachedAccessToken(clientId, item) {
        const updated = await AccessTokenHelpers.refreshToken(clientId, item.refresh_token);
        return AccessTokenHelpers.toCachable(updated);
    }
    static toCachable(item) {
        if (item.expires && item.expires === -1) {
            return item;
        }
        return { ...item, expires: this.calculateExpiry(item) };
    }
    static calculateExpiry(item) {
        return Date.now() + (item.expires_in * 1000);
    }
    static async refreshToken(clientId, refreshToken) {
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });
        const text = await result.text();
        if (!result.ok) {
            throw new Error(`Failed to refresh token: ${result.statusText}, ${text}`);
        }
        const json = JSON.parse(text);
        return json;
    }
    static generateCodeVerifier(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    static async generateCodeChallenge(codeVerifier) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await Crypto.current.subtle.digest('SHA-256', data);
        const digestBytes = [...new Uint8Array(digest)];
        const hasBuffer = typeof Buffer !== 'undefined';
        const digestAsBase64 = hasBuffer
            ? Buffer.from(digest).toString('base64')
            : btoa(String.fromCharCode.apply(null, digestBytes));
        return digestAsBase64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}
//# sourceMappingURL=AccessTokenHelpers.js.map