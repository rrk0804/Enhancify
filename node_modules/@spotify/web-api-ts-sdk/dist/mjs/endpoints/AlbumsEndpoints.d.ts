import type { Market, Album, MaxInt, Page, SimplifiedTrack } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class AlbumsEndpoints extends EndpointsBase {
    get(id: string, market?: Market): Promise<Album>;
    get(ids: string[], market?: Market): Promise<Album[]>;
    tracks(albumId: string, market?: Market, limit?: MaxInt<50>, offset?: number): Promise<Page<SimplifiedTrack>>;
}
