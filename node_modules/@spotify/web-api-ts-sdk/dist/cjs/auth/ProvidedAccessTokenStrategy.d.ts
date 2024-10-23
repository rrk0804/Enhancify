import { AccessToken, SdkConfiguration } from "../types.js";
import IAuthStrategy from "./IAuthStrategy.js";
/**
 * This strategy is used when you already have an access token and want to use it.
 * The authentication strategy will automatically renew the token when it expires.
 * Designed to allow a browser-based-app to post the access token to the server and use it from there.
 * @constructor
 * @param {string} clientId - Spotify application client id.
 * @param {string} accessToken - The access token returned from a client side Authorization Code with PKCE flow.
 */
export default class ProvidedAccessTokenStrategy implements IAuthStrategy {
    protected clientId: string;
    protected accessToken: AccessToken;
    private refreshTokenAction;
    constructor(clientId: string, accessToken: AccessToken, refreshTokenAction?: (clientId: string, token: AccessToken) => Promise<AccessToken>);
    setConfiguration(_: SdkConfiguration): void;
    getOrCreateAccessToken(): Promise<AccessToken>;
    getAccessToken(): Promise<AccessToken | null>;
    removeAccessToken(): void;
}
