import AlbumsEndpoints from "./endpoints/AlbumsEndpoints.js";
import ArtistsEndpoints from "./endpoints/ArtistsEndpoints.js";
import AudiobooksEndpoints from "./endpoints/AudiobooksEndpoints.js";
import BrowseEndpoints from "./endpoints/BrowseEndpoints.js";
import ChaptersEndpoints from "./endpoints/ChaptersEndpoints.js";
import EpisodesEndpoints from "./endpoints/EpisodesEndpoints.js";
import RecommendationsEndpoints from "./endpoints/RecommendationsEndpoints.js";
import MarketsEndpoints from "./endpoints/MarketsEndpoints.js";
import PlayerEndpoints from "./endpoints/PlayerEndpoints.js";
import PlaylistsEndpoints from "./endpoints/PlaylistsEndpoints.js";
import SearchEndpoints from "./endpoints/SearchEndpoints.js";
import ShowsEndpoints from "./endpoints/ShowsEndpoints.js";
import TracksEndpoints from "./endpoints/TracksEndpoints.js";
import { isEmptyAccessToken } from "./auth/IAuthStrategy.js";
import UsersEndpoints from "./endpoints/UsersEndpoints.js";
import CurrentUserEndpoints from "./endpoints/CurrentUserEndpoints.js";
import ClientCredentialsStrategy from "./auth/ClientCredentialsStrategy.js";
import ImplicitGrantStrategy from "./auth/ImplicitGrantStrategy.js";
import AuthorizationCodeWithPKCEStrategy from "./auth/AuthorizationCodeWithPKCEStrategy.js";
import DefaultResponseDeserializer from "./serialization/DefaultResponseDeserializer.js";
import DefaultResponseValidator from "./responsevalidation/DefaultResponseValidator.js";
import NoOpErrorHandler from "./errorhandling/NoOpErrorHandler.js";
import DocumentLocationRedirectionStrategy from "./redirection/DocumentLocationRedirectionStrategy.js";
import LocalStorageCachingStrategy from "./caching/LocalStorageCachingStrategy.js";
import InMemoryCachingStrategy from "./caching/InMemoryCachingStrategy.js";
import ProvidedAccessTokenStrategy from "./auth/ProvidedAccessTokenStrategy.js";
export class SpotifyApi {
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
        this.albums = new AlbumsEndpoints(this);
        this.artists = new ArtistsEndpoints(this);
        this.audiobooks = new AudiobooksEndpoints(this);
        this.browse = new BrowseEndpoints(this);
        this.chapters = new ChaptersEndpoints(this);
        this.episodes = new EpisodesEndpoints(this);
        this.recommendations = new RecommendationsEndpoints(this);
        this.markets = new MarketsEndpoints(this);
        this.player = new PlayerEndpoints(this);
        this.playlists = new PlaylistsEndpoints(this);
        this.shows = new ShowsEndpoints(this);
        this.tracks = new TracksEndpoints(this);
        this.users = new UsersEndpoints(this);
        this.currentUser = new CurrentUserEndpoints(this);
        const search = new SearchEndpoints(this);
        this.search = search.execute.bind(search);
        this.authenticationStrategy = authentication;
        this.authenticationStrategy.setConfiguration(this.sdkConfig);
    }
    async makeRequest(method, url, body = undefined, contentType = undefined) {
        try {
            const accessToken = await this.authenticationStrategy.getOrCreateAccessToken();
            if (isEmptyAccessToken(accessToken)) {
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
            deserializer: new DefaultResponseDeserializer(),
            responseValidator: new DefaultResponseValidator(),
            errorHandler: new NoOpErrorHandler(),
            redirectionStrategy: new DocumentLocationRedirectionStrategy(),
            cachingStrategy: isBrowser
                ? new LocalStorageCachingStrategy()
                : new InMemoryCachingStrategy()
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
            authenticated: response.expires > Date.now() && !isEmptyAccessToken(response),
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
        const strategy = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
        return new SpotifyApi(strategy, config);
    }
    static withClientCredentials(clientId, clientSecret, scopes = [], config) {
        const strategy = new ClientCredentialsStrategy(clientId, clientSecret, scopes);
        return new SpotifyApi(strategy, config);
    }
    static withImplicitGrant(clientId, redirectUri, scopes = [], config) {
        const strategy = new ImplicitGrantStrategy(clientId, redirectUri, scopes);
        return new SpotifyApi(strategy, config);
    }
    /**
     * Use this when you're running in a Node environment, and accepting the access token from a client-side `performUserAuthorization` call.
     * You can also use this method if you already have an access token and don't want to use the built-in authentication strategies.
     */
    static withAccessToken(clientId, token, config) {
        const strategy = new ProvidedAccessTokenStrategy(clientId, token);
        return new SpotifyApi(strategy, config);
    }
    static async performUserAuthorization(clientId, redirectUri, scopes, onAuthorizationOrUrl, config) {
        const strategy = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
        const client = new SpotifyApi(strategy, config);
        const accessToken = await client.authenticationStrategy.getOrCreateAccessToken();
        if (!isEmptyAccessToken(accessToken)) {
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
            authenticated: accessToken.expires > Date.now() && !isEmptyAccessToken(accessToken),
            accessToken
        };
    }
}
//# sourceMappingURL=SpotifyApi.js.map