/// <reference types="node" />
import type { Market, Playlist, MaxInt, Page, Track, SnapshotReference, Image, PlaylistedTrack, QueryAdditionalTypes, TrackItem } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class PlaylistsEndpoints extends EndpointsBase {
    getPlaylist<AdditionalTypes extends QueryAdditionalTypes | undefined = undefined>(playlist_id: string, market?: Market, fields?: string, additional_types?: AdditionalTypes): Promise<Playlist<AdditionalTypes extends undefined ? Track : TrackItem>>;
    getPlaylistItems<AdditionalTypes extends QueryAdditionalTypes | undefined = undefined>(playlist_id: string, market?: Market, fields?: string, limit?: MaxInt<50>, offset?: number, additional_types?: AdditionalTypes): Promise<Page<PlaylistedTrack<AdditionalTypes extends undefined ? Track : TrackItem>>>;
    changePlaylistDetails(playlist_id: string, request: ChangePlaylistDetailsRequest): Promise<void>;
    movePlaylistItems(playlist_id: string, range_start: number, range_length: number, moveToPosition: number): Promise<SnapshotReference>;
    updatePlaylistItems(playlist_id: string, request: UpdatePlaylistItemsRequest): Promise<SnapshotReference>;
    addItemsToPlaylist(playlist_id: string, uris?: string[], position?: number): Promise<void>;
    removeItemsFromPlaylist(playlist_id: string, request: RemovePlaylistItemsRequest): Promise<void>;
    getUsersPlaylists(user_id: string, limit?: MaxInt<50>, offset?: number): Promise<Page<Playlist<TrackItem>>>;
    createPlaylist(user_id: string, request: CreatePlaylistRequest): Promise<Playlist<TrackItem>>;
    getPlaylistCoverImage(playlist_id: string): Promise<Image[]>;
    addCustomPlaylistCoverImage(playlist_id: string, imageData: Buffer | HTMLImageElement | HTMLCanvasElement | string): Promise<void>;
    addCustomPlaylistCoverImageFromBase64String(playlist_id: string, base64EncodedJpeg: string): Promise<void>;
}
interface RemovePlaylistItemsRequest {
    tracks: Array<{
        uri: string;
    }>;
    snapshot_id?: string;
}
interface UpdatePlaylistItemsRequest {
    uris?: string[];
    range_start?: number;
    insert_before?: number;
    range_length?: number;
    snapshot_id?: string;
}
interface ChangePlaylistDetailsRequest {
    name?: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
}
interface CreatePlaylistRequest {
    name: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
}
export {};
