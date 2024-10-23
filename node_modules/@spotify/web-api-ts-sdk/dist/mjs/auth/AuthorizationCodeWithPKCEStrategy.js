import AccessTokenHelpers from "./AccessTokenHelpers.js";
import { emptyAccessToken } from "./IAuthStrategy.js";
export default class AuthorizationCodeWithPKCEStrategy {
    clientId;
    redirectUri;
    scopes;
    static cacheKey = "spotify-sdk:AuthorizationCodeWithPKCEStrategy:token";
    configuration = null;
    get cache() { return this.configuration.cachingStrategy; }
    constructor(clientId, redirectUri, scopes) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.scopes = scopes;
    }
    setConfiguration(configuration) {
        this.configuration = configuration;
    }
    async getOrCreateAccessToken() {
        const token = await this.cache.getOrCreate(AuthorizationCodeWithPKCEStrategy.cacheKey, async () => {
            const token = await this.redirectOrVerifyToken();
            return AccessTokenHelpers.toCachable(token);
        }, async (expiring) => {
            return AccessTokenHelpers.refreshCachedAccessToken(this.clientId, expiring);
        });
        return token;
    }
    async getAccessToken() {
        const token = await this.cache.get(AuthorizationCodeWithPKCEStrategy.cacheKey);
        return token;
    }
    removeAccessToken() {
        this.cache.remove(AuthorizationCodeWithPKCEStrategy.cacheKey);
    }
    async redirectOrVerifyToken() {
        const hashParams = new URLSearchParams(window.location.search);
        const code = hashParams.get("code");
        if (code) {
            const token = await this.verifyAndExchangeCode(code);
            this.removeCodeFromUrl();
            return token;
        }
        this.redirectToSpotify();
        return emptyAccessToken; // Redirected away at this point, just make TypeScript happy :)         
    }
    async redirectToSpotify() {
        const verifier = AccessTokenHelpers.generateCodeVerifier(128);
        const challenge = await AccessTokenHelpers.generateCodeChallenge(verifier);
        const singleUseVerifier = { verifier, expiresOnAccess: true };
        this.cache.setCacheItem("spotify-sdk:verifier", singleUseVerifier);
        const redirectTarget = await this.generateRedirectUrlForUser(this.scopes, challenge);
        await this.configuration.redirectionStrategy.redirect(redirectTarget);
    }
    async verifyAndExchangeCode(code) {
        const cachedItem = await this.cache.get("spotify-sdk:verifier");
        const verifier = cachedItem?.verifier;
        if (!verifier) {
            throw new Error("No verifier found in cache - can't validate query string callback parameters.");
        }
        await this.configuration.redirectionStrategy.onReturnFromRedirect();
        return await this.exchangeCodeForToken(code, verifier);
    }
    removeCodeFromUrl() {
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        const newUrl = url.search ? url.href : url.href.replace('?', '');
        window.history.replaceState({}, document.title, newUrl);
    }
    async generateRedirectUrlForUser(scopes, challenge) {
        const scope = scopes.join(' ');
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", this.redirectUri);
        params.append("scope", scope);
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }
    async exchangeCodeForToken(code, verifier) {
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", this.redirectUri);
        params.append("code_verifier", verifier);
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });
        const text = await result.text();
        if (!result.ok) {
            throw new Error(`Failed to exchange code for token: ${result.statusText}, ${text}`);
        }
        const json = JSON.parse(text);
        return json;
    }
}
//# sourceMappingURL=AuthorizationCodeWithPKCEStrategy.js.map