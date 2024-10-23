import type { SdkConfiguration, AccessToken } from "../types.js";
import IAuthStrategy from "./IAuthStrategy.js";
export default class ImplicitGrantStrategy implements IAuthStrategy {
    private clientId;
    private redirectUri;
    private scopes;
    private static readonly cacheKey;
    private configuration;
    private get cache();
    constructor(clientId: string, redirectUri: string, scopes: string[]);
    setConfiguration(configuration: SdkConfiguration): void;
    getOrCreateAccessToken(): Promise<AccessToken>;
    getAccessToken(): Promise<AccessToken | null>;
    removeAccessToken(): void;
    private redirectOrVerifyToken;
}
