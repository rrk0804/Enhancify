import AccessTokenHelpers from "./AccessTokenHelpers.js";
export default class ClientCredentialsStrategy {
    clientId;
    clientSecret;
    scopes;
    static cacheKey = "spotify-sdk:ClientCredentialsStrategy:token";
    configuration = null;
    get cache() { return this.configuration.cachingStrategy; }
    constructor(clientId, clientSecret, scopes = []) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.scopes = scopes;
    }
    setConfiguration(configuration) {
        this.configuration = configuration;
    }
    async getOrCreateAccessToken() {
        const token = await this.cache.getOrCreate(ClientCredentialsStrategy.cacheKey, async () => {
            const token = await this.getTokenFromApi();
            return AccessTokenHelpers.toCachable(token);
        }, async (_) => {
            const refreshed = await this.getTokenFromApi();
            return AccessTokenHelpers.toCachable(refreshed);
        });
        return token;
    }
    async getAccessToken() {
        const token = await this.cache.get(ClientCredentialsStrategy.cacheKey);
        return token;
    }
    removeAccessToken() {
        this.cache.remove(ClientCredentialsStrategy.cacheKey);
    }
    async getTokenFromApi() {
        const options = {
            grant_type: 'client_credentials',
            scope: this.scopes.join(' ')
        };
        const bodyAsString = Object.keys(options).map(key => key + '=' + options[key]).join('&');
        const hasBuffer = typeof Buffer !== 'undefined';
        const credentials = `${this.clientId}:${this.clientSecret}`;
        const basicAuth = hasBuffer
            ? Buffer.from(credentials).toString('base64')
            : btoa(credentials);
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${basicAuth}`
            },
            body: bodyAsString
        });
        if (result.status !== 200) {
            throw new Error("Failed to get access token.");
        }
        const json = await result.json();
        return json;
    }
}
//# sourceMappingURL=ClientCredentialsStrategy.js.map