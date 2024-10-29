import type { Artist, Artists, Market, MaxInt, Page, SimplifiedAlbum, TopTracksResult } from "../types.js";
import EndpointsBase from "./EndpointsBase.js";
export default class ArtistsEndpoints extends EndpointsBase {
    get(id: string): Promise<Artist>;
    get(ids: string[]): Promise<Artist[]>;
    albums(id: string, includeGroups?: string, market?: Market, limit?: MaxInt<50>, offset?: number): Promise<Page<SimplifiedAlbum>>;
    topTracks(id: string, market: Market): Promise<TopTracksResult>;
    relatedArtists(id: string): Promise<Artists>;
}
