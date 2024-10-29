import { SpotifyApi } from '../SpotifyApi.js';
import type { Page, Artist, Track, MaxInt, FollowedArtists, Market, SavedAlbum, SimplifiedAudiobook, SimplifiedPlaylist, SavedEpisode, SavedShow, SavedTrack, UserProfile } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class CurrentUserEndpoints extends EndpointsBase {
    albums: CurrentUserAlbumsEndpoints;
    audiobooks: CurrentUserAudiobooksEndpoints;
    episodes: CurrentUserEpisodesEndpoints;
    playlists: CurrentUserPlaylistsEndpoints;
    shows: CurrentUserShowsEndpoints;
    tracks: CurrentUserTracksEndpoints;
    constructor(api: SpotifyApi);
    profile(): Promise<UserProfile>;
    topItems<T extends "artists" | "tracks">(type: T, time_range?: 'short_term' | 'medium_term' | 'long_term', limit?: MaxInt<50>, offset?: number): Promise<Page<T extends "artists" ? Artist : Track>>;
    followedArtists(after?: string, limit?: MaxInt<50>): Promise<FollowedArtists>;
    followArtistsOrUsers(ids: string[], type: 'artist' | 'user'): Promise<void>;
    unfollowArtistsOrUsers(ids: string[], type: 'artist' | 'user'): Promise<void>;
    followsArtistsOrUsers(ids: string[], type: 'artist' | 'user'): Promise<boolean[]>;
}
declare class CurrentUserAlbumsEndpoints extends EndpointsBase {
    savedAlbums(limit?: MaxInt<50>, offset?: number, market?: Market): Promise<Page<SavedAlbum>>;
    saveAlbums(ids: string[]): Promise<void>;
    removeSavedAlbums(ids: string[]): Promise<void>;
    hasSavedAlbums(ids: string[]): Promise<boolean[]>;
}
declare class CurrentUserAudiobooksEndpoints extends EndpointsBase {
    savedAudiobooks(limit?: MaxInt<50>, offset?: number): Promise<Page<SimplifiedAudiobook>>;
    saveAudiobooks(ids: string[]): Promise<void>;
    removeSavedAudiobooks(ids: string[]): Promise<void>;
    hasSavedAudiobooks(ids: string[]): Promise<boolean[]>;
}
declare class CurrentUserEpisodesEndpoints extends EndpointsBase {
    savedEpisodes(market?: Market, limit?: MaxInt<50>, offset?: number): Promise<Page<SavedEpisode>>;
    saveEpisodes(ids: string[]): Promise<void>;
    removeSavedEpisodes(ids: string[]): Promise<void>;
    hasSavedEpisodes(ids: string[]): Promise<boolean[]>;
}
declare class CurrentUserPlaylistsEndpoints extends EndpointsBase {
    playlists(limit?: MaxInt<50>, offset?: number): Promise<Page<SimplifiedPlaylist>>;
    follow(playlist_id: string): Promise<void>;
    unfollow(playlist_id: string): Promise<void>;
    isFollowing(playlistId: string, ids: string[]): Promise<boolean[]>;
}
declare class CurrentUserShowsEndpoints extends EndpointsBase {
    savedShows(limit?: MaxInt<50>, offset?: number): Promise<Page<SavedShow>>;
    saveShows(ids: string[]): Promise<unknown>;
    removeSavedShows(ids: string[], market?: Market): Promise<unknown>;
    hasSavedShow(ids: string[]): Promise<boolean[]>;
}
declare class CurrentUserTracksEndpoints extends EndpointsBase {
    savedTracks(limit?: MaxInt<50>, offset?: number, market?: Market): Promise<Page<SavedTrack>>;
    saveTracks(ids: string[]): Promise<void>;
    removeSavedTracks(ids: string[]): Promise<void>;
    hasSavedTracks(ids: string[]): Promise<boolean[]>;
}
export {};
