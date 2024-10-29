"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccessTokenHelpers_js_1 = __importDefault(require("./AccessTokenHelpers.js"));
const IAuthStrategy_js_1 = require("./IAuthStrategy.js");
class ImplicitGrantStrategy {
    clientId;
    redirectUri;
    scopes;
    static cacheKey = "spotify-sdk:ImplicitGrantStrategy:token";
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
        const token = await this.cache.getOrCreate(ImplicitGrantStrategy.cacheKey, async () => {
            const token = await this.redirectOrVerifyToken();
            return AccessTokenHelpers_js_1.default.toCachable(token);
        }, async (expiring) => {
            return AccessTokenHelpers_js_1.default.refreshCachedAccessToken(this.clientId, expiring);
        });
        return token;
    }
    async getAccessToken() {
        const token = await this.cache.get(ImplicitGrantStrategy.cacheKey);
        return token;
    }
    removeAccessToken() {
        this.cache.remove(ImplicitGrantStrategy.cacheKey);
    }
    async redirectOrVerifyToken() {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
            return Promise.resolve({
                access_token: accessToken,
                token_type: hashParams.get("token_type") ?? "",
                expires_in: parseInt(hashParams.get("expires_in") ?? "0"),
                refresh_token: hashParams.get("refresh_token") ?? "",
                expires: Number(hashParams.get("expires")) || 0
            });
        }
        const scopes = this.scopes ?? [];
        var scope = scopes.join(' ');
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("response_type", "token");
        params.append("redirect_uri", this.redirectUri);
        params.append("scope", scope);
        const authUrl = 'https://accounts.spotify.com/authorize?' + params.toString();
        this.configuration.redirectionStrategy.redirect(authUrl);
        return IAuthStrategy_js_1.emptyAccessToken;
    }
}
exports.default = ImplicitGrantStrategy;
//# sourceMappingURL=ImplicitGrantStrategy.js.map