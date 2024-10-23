"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyApi = void 0;
const AlbumsEndpoints_js_1 = __importDefault(require("./endpoints/AlbumsEndpoints.js"));
const ArtistsEndpoints_js_1 = __importDefault(require("./endpoints/ArtistsEndpoints.js"));
const AudiobooksEndpoints_js_1 = __importDefault(require("./endpoints/AudiobooksEndpoints.js"));
const BrowseEndpoints_js_1 = __importDefault(require("./endpoints/BrowseEndpoints.js"));
const ChaptersEndpoints_js_1 = __importDefault(require("./endpoints/ChaptersEndpoints.js"));
const EpisodesEndpoints_js_1 = __importDefault(require("./endpoints/EpisodesEndpoints.js"));
const RecommendationsEndpoints_js_1 = __importDefault(require("./endpoints/RecommendationsEndpoints.js"));
const MarketsEndpoints_js_1 = __importDefault(require("./endpoints/MarketsEndpoints.js"));
const PlayerEndpoints_js_1 = __importDefault(require("./endpoints/PlayerEndpoints.js"));
const PlaylistsEndpoints_js_1 = __importDefault(require("./endpoints/PlaylistsEndpoints.js"));
const SearchEndpoints_js_1 = __importDefault(require("./endpoints/SearchEndpoints.js"));
const ShowsEndpoints_js_1 = __importDefault(require("./endpoints/ShowsEndpoints.js"));
const TracksEndpoints_js_1 = __importDefault(require("./endpoints/TracksEndpoints.js"));
const IAuthStrategy_js_1 = require("./auth/IAuthStrategy.js");
const UsersEndpoints_js_1 = __importDefault(require("./endpoints/UsersEndpoints.js"));
const CurrentUserEndpoints_js_1 = __importDefault(require("./endpoints/CurrentUserEndpoints.js"));
const ClientCredentialsStrategy_js_1 = __importDefault(require("./auth/ClientCredentialsStrategy.js"));
const ImplicitGrantStrategy_js_1 = __importDefault(require("./auth/ImplicitGrantStrategy.js"));
const AuthorizationCodeWithPKCEStrategy_js_1 = __importDefault(require("./auth/AuthorizationCodeWithPKCEStrategy.js"));
const DefaultResponseDeserializer_js_1 = __importDefault(require("./serialization/DefaultResponseDeserializer.js"));
const DefaultResponseValidator_js_1 = __importDefault(require("./responsevalidation/DefaultResponseValidator.js"));
const NoOpErrorHandler_js_1 = __importDefault(require("./errorhandling/NoOpErrorHandler.js"));
const DocumentLocationRedirectionStrategy_js_1 = __importDefault(require("./redirection/DocumentLocationRedirectionStrategy.js"));
const LocalStorageCachingStrategy_js_1 = __importDefault(require("./caching/LocalStorageCachingStrategy.js"));
const InMemoryCachingStrategy_js_1 = __importDefault(require("./caching/InMemoryCachingStrategy.js"));
const ProvidedAccessTokenStrategy_js_1 = __importDefault(require("./auth/ProvidedAccessTokenStrategy.js"));
class SpotifyApi {
    sdkConfig;
    static rootUrl = "https://api.spotify.com/v1/";
    authenticationStrategy;
    albums;
    artists;
    audiobooks;
    browse;
    chapters;
    episodes;
    recommendations;
    markets;
    player;
    playlists;
    shows;
    tracks;
    users;
    search;
    currentUser;
    constructor(authentication, config) {
        this.sdkConfig = this.initializeSdk(config);
        this.albums = new AlbumsEndpoints_js_1.default(this);
        this.artists = new ArtistsEndpoints_js_1.default(this);
        this.audiobooks = new AudiobooksEndpoints_js_1.default(this);
        this.browse = new BrowseEndpoints_js_1.default(this);
        this.chapters = new ChaptersEndpoints_js_1.default(this);
        this.episodes = new EpisodesEndpoints_js_1.default(this);
        this.recommendations = new RecommendationsEndpoints_js_1.default(this);
        this.markets = new MarketsEndpoints_js_1.default(this);
        this.player = new PlayerEndpoints_js_1.default(this);
        this.playlists = new PlaylistsEndpoints_js_1.default(this);
        this.shows = new ShowsEndpoints_js_1.default(this);
        this.tracks = new TracksEndpoints_js_1.default(this);
        this.users = new UsersEndpoints_js_1.default(this);
        this.currentUser = new CurrentUserEndpoints_js_1.default(this);
        const search = new SearchEndpoints_js_1.default(this);
        this.search = search.execute.bind(search);
        this.authenticationStrategy = authentication;
        this.authenticationStrategy.setConfiguration(this.sdkConfig);
    }
    async makeRequest(method, url, body = undefined, contentType = undefined) {
        try {
            const accessToken = await this.authenticationStrategy.getOrCreateAccessToken();
            if ((0, IAuthStrategy_js_1.isEmptyAccessToken)(accessToken)) {
                console.warn("No access token found, authenticating now.");
                return null;
            }
            const token = accessToken?.access_token;
            const fullUrl = SpotifyApi.rootUrl + url;
            const opts = {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": contentType ?? "application/json"
                },
                body: body ? typeof body === "string" ? body : JSON.stringify(body) : undefined
            };
            this.sdkConfig.beforeRequest(fullUrl, opts);
            const result = await this.sdkConfig.fetch(fullUrl, opts);
            this.sdkConfig.afterRequest(fullUrl, opts, result);
            if (result.status === 204) {
                return null;
            }
            await this.sdkConfig.responseValidator.validateResponse(result);
            return this.sdkConfig.deserializer.deserialize(result);
        }
        catch (error) {
            const handled = await this.sdkConfig.errorHandler.handleErrors(error);
            if (!handled) {
                throw error;
            }
            return null;
        }
    }
    initializeSdk(config) {
        const isBrowser = typeof window !== 'undefined';
        const defaultConfig = {
            fetch: (req, init) => fetch(req, init),
            beforeRequest: (_, __) => { },
            afterRequest: (_, __, ___) => { },
            deserializer: new DefaultResponseDeserializer_js_1.default(),
            responseValidator: new DefaultResponseValidator_js_1.default(),
            errorHandler: new NoOpErrorHandler_js_1.default(),
            redirectionStrategy: new DocumentLocationRedirectionStrategy_js_1.default(),
            cachingStrategy: isBrowser
                ? new LocalStorageCachingStrategy_js_1.default()
                : new InMemoryCachingStrategy_js_1.default()
        };
        return { ...defaultConfig, ...config };
    }
    switchAuthenticationStrategy(authentication) {
        this.authenticationStrategy = authentication;
        this.authenticationStrategy.setConfiguration(this.sdkConfig);
        this.authenticationStrategy.getOrCreateAccessToken(); // trigger any redirects 
    }
    /**
     * Use this when you're running in a browser and you want to control when first authentication+redirect happens.
    */
    async authenticate() {
        const response = await this.authenticationStrategy.getOrCreateAccessToken(); // trigger any redirects
        return {
            authenticated: response.expires > Date.now() && !(0, IAuthStrategy_js_1.isEmptyAccessToken)(response),
            accessToken: response
        };
    }
    /**
     * @returns the current access token. null implies the SpotifyApi is not yet authenticated.
     */
    async getAccessToken() {
        return this.authenticationStrategy.getAccessToken();
    }
    /**
     * Removes the access token if it exists.
     */
    logOut() {
        this.authenticationStrategy.removeAccessToken();
    }
    static withUserAuthorization(clientId, redirectUri, scopes = [], config) {
        const strategy = new AuthorizationCodeWithPKCEStrategy_js_1.default(clientId, redirectUri, scopes);
        return new SpotifyApi(strategy, config);
    }
    static withClientCredentials(clientId, clientSecret, scopes = [], config) {
        const strategy = new ClientCredentialsStrategy_js_1.default(clientId, clientSecret, scopes);
        return new SpotifyApi(strategy, config);
    }
    static withImplicitGrant(clientId, redirectUri, scopes = [], config) {
        const strategy = new ImplicitGrantStrategy_js_1.default(clientId, redirectUri, scopes);
        return new SpotifyApi(strategy, config);
    }
    /**
     * Use this when you're running in a Node environment, and accepting the access token from a client-side `performUserAuthorization` call.
     * You can also use this method if you already have an access token and don't want to use the built-in authentication strategies.
     */
    static withAccessToken(clientId, token, config) {
        const strategy = new ProvidedAccessTokenStrategy_js_1.default(clientId, token);
        return new SpotifyApi(strategy, config);
    }
    static async performUserAuthorization(clientId, redirectUri, scopes, onAuthorizationOrUrl, config) {
        const strategy = new AuthorizationCodeWithPKCEStrategy_js_1.default(clientId, redirectUri, scopes);
        const client = new SpotifyApi(strategy, config);
        const accessToken = await client.authenticationStrategy.getOrCreateAccessToken();
        if (!(0, IAuthStrategy_js_1.isEmptyAccessToken)(accessToken)) {
            if (typeof onAuthorizationOrUrl === "string") {
                console.log("Posting access token to postback URL.");
                await fetch(onAuthorizationOrUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(accessToken)
                });
            }
            else {
                await onAuthorizationOrUrl(accessToken);
            }
        }
        return {
            authenticated: accessToken.expires > Date.now() && !(0, IAuthStrategy_js_1.isEmptyAccessToken)(accessToken),
            accessToken
        };
    }
}
exports.SpotifyApi = SpotifyApi;
//# sourceMappingURL=SpotifyApi.js.map