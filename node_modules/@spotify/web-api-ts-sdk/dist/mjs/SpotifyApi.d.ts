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
import { SearchExecutionFunction } from "./endpoints/SearchEndpoints.js";
import ShowsEndpoints from "./endpoints/ShowsEndpoints.js";
import TracksEndpoints from "./endpoints/TracksEndpoints.js";
import IAuthStrategy from "./auth/IAuthStrategy.js";
import UsersEndpoints from "./endpoints/UsersEndpoints.js";
import CurrentUserEndpoints from "./endpoints/CurrentUserEndpoints.js";
import type { AccessToken, SdkOptions, AuthenticationResponse } from "./types.js";
export declare class SpotifyApi {
    private sdkConfig;
    private static rootUrl;
    private authenticationStrategy;
    albums: AlbumsEndpoints;
    artists: ArtistsEndpoints;
    audiobooks: AudiobooksEndpoints;
    browse: BrowseEndpoints;
    chapters: ChaptersEndpoints;
    episodes: EpisodesEndpoints;
    recommendations: RecommendationsEndpoints;
    markets: MarketsEndpoints;
    player: PlayerEndpoints;
    playlists: PlaylistsEndpoints;
    shows: ShowsEndpoints;
    tracks: TracksEndpoints;
    users: UsersEndpoints;
    search: SearchExecutionFunction;
    currentUser: CurrentUserEndpoints;
    constructor(authentication: IAuthStrategy, config?: SdkOptions);
    makeRequest<TReturnType>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, body?: any, contentType?: string | undefined): Promise<TReturnType>;
    private initializeSdk;
    switchAuthenticationStrategy(authentication: IAuthStrategy): void;
    /**
     * Use this when you're running in a browser and you want to control when first authentication+redirect happens.
    */
    authenticate(): Promise<AuthenticationResponse>;
    /**
     * @returns the current access token. null implies the SpotifyApi is not yet authenticated.
     */
    getAccessToken(): Promise<AccessToken | null>;
    /**
     * Removes the access token if it exists.
     */
    logOut(): void;
    static withUserAuthorization(clientId: string, redirectUri: string, scopes?: string[], config?: SdkOptions): SpotifyApi;
    static withClientCredentials(clientId: string, clientSecret: string, scopes?: string[], config?: SdkOptions): SpotifyApi;
    static withImplicitGrant(clientId: string, redirectUri: string, scopes?: string[], config?: SdkOptions): SpotifyApi;
    /**
     * Use this when you're running in a Node environment, and accepting the access token from a client-side `performUserAuthorization` call.
     * You can also use this method if you already have an access token and don't want to use the built-in authentication strategies.
     */
    static withAccessToken(clientId: string, token: AccessToken, config?: SdkOptions): SpotifyApi;
    /**
     * Use this when you're running in the browser, and want to perform the user authorization flow to post back to your server with the access token.
     * @param clientId Your Spotify client ID
     * @param redirectUri The URI to redirect to after the user has authorized your app
     * @param scopes The scopes to request
     * @param postbackUrl The URL to post the access token to
     * @param config Optional configuration
     */
    static performUserAuthorization(clientId: string, redirectUri: string, scopes: string[], postbackUrl: string, config?: SdkOptions): Promise<AuthenticationResponse>;
    /**
     * Use this when you're running in the browser, and want to perform the user authorization flow to post back to your server with the access token.
     * This overload is provided for you to perform the postback yourself, if you want to do something other than a simple HTTP POST to a URL - for example, if you want to use a WebSocket, or provide custom authentication.
     * @param clientId Your Spotify client ID
     * @param redirectUri The URI to redirect to after the user has authorized your app
     * @param scopes The scopes to request
     * @param onAuthorization A function to call with the access token where YOU perform the server-side postback
     * @param config Optional configuration
     */
    static performUserAuthorization(clientId: string, redirectUri: string, scopes: string[], onAuthorization: (token: AccessToken) => Promise<void>, config?: SdkOptions): Promise<AuthenticationResponse>;
}
