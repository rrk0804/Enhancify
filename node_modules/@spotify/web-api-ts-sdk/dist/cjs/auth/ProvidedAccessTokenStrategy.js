"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccessTokenHelpers_js_1 = __importDefault(require("./AccessTokenHelpers.js"));
/**
 * This strategy is used when you already have an access token and want to use it.
 * The authentication strategy will automatically renew the token when it expires.
 * Designed to allow a browser-based-app to post the access token to the server and use it from there.
 * @constructor
 * @param {string} clientId - Spotify application client id.
 * @param {string} accessToken - The access token returned from a client side Authorization Code with PKCE flow.
 */
class ProvidedAccessTokenStrategy {
    clientId;
    accessToken;
    refreshTokenAction;
    constructor(clientId, accessToken, refreshTokenAction) {
        this.clientId = clientId;
        this.accessToken = accessToken;
        this.refreshTokenAction = refreshTokenAction || AccessTokenHelpers_js_1.default.refreshCachedAccessToken;
        // If the raw token from the jwt response is provided here
        // Calculate an absolute `expiry` value.
        // Caveat: If this token isn't fresh, this value will be off.
        // It's the responsibility of the calling code to either set a valid
        // expires property, or ensure expires_in accounts for any lag between
        // issuing and passing here.
        if (!this.accessToken.expires) {
            this.accessToken.expires = AccessTokenHelpers_js_1.default.calculateExpiry(this.accessToken);
        }
    }
    setConfiguration(_) {
    }
    async getOrCreateAccessToken() {
        if (this.accessToken.expires && this.accessToken.expires <= Date.now()) {
            const refreshed = await this.refreshTokenAction(this.clientId, this.accessToken);
            this.accessToken = refreshed;
        }
        return this.accessToken;
    }
    async getAccessToken() {
        return this.accessToken;
    }
    removeAccessToken() {
        this.accessToken = {
            access_token: "",
            token_type: "",
            expires_in: 0,
            refresh_token: "",
            expires: 0
        };
    }
}
exports.default = ProvidedAccessTokenStrategy;
//# sourceMappingURL=ProvidedAccessTokenStrategy.js.map