import type { SdkConfiguration, AccessToken, ICachingStrategy } from "../types.js";
import IAuthStrategy from "./IAuthStrategy.js";
export default class AuthorizationCodeWithPKCEStrategy implements IAuthStrategy {
    protected clientId: string;
    protected redirectUri: string;
    protected scopes: string[];
    private static readonly cacheKey;
    private configuration;
    protected get cache(): ICachingStrategy;
    constructor(clientId: string, redirectUri: string, scopes: string[]);
    setConfiguration(configuration: SdkConfiguration): void;
    getOrCreateAccessToken(): Promise<AccessToken>;
    getAccessToken(): Promise<AccessToken | null>;
    removeAccessToken(): void;
    private redirectOrVerifyToken;
    private redirectToSpotify;
    private verifyAndExchangeCode;
    private removeCodeFromUrl;
    protected generateRedirectUrlForUser(scopes: string[], challenge: string): Promise<string>;
    protected exchangeCodeForToken(code: string, verifier: string): Promise<AccessToken>;
}
