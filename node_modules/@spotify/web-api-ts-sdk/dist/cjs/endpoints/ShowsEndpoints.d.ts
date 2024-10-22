import type { Market, Show, MaxInt, Page, SimplifiedEpisode } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class ShowsEndpoints extends EndpointsBase {
    get(id: string, market: Market): Promise<Show>;
    get(ids: string[], market: Market): Promise<Show[]>;
    episodes(id: string, market?: Market, limit?: MaxInt<50>, offset?: number): Promise<Page<SimplifiedEpisode>>;
}
