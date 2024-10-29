import type { SdkConfiguration, AccessToken } from "../types.js";
import IAuthStrategy from "./IAuthStrategy.js";
export default class ClientCredentialsStrategy implements IAuthStrategy {
    private clientId;
    private clientSecret;
    private scopes;
    private static readonly cacheKey;
    private configuration;
    private get cache();
    constructor(clientId: string, clientSecret: string, scopes?: string[]);
    setConfiguration(configuration: SdkConfiguration): void;
    getOrCreateAccessToken(): Promise<AccessToken>;
    getAccessToken(): Promise<AccessToken | null>;
    removeAccessToken(): void;
    private getTokenFromApi;
}
