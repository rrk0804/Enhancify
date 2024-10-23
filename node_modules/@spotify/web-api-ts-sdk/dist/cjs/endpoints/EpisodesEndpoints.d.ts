import type { Market, Episode } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class EpisodesEndpoints extends EndpointsBase {
    get(id: string, market: Market): Promise<Episode>;
    get(ids: string[], market: Market): Promise<Episode[]>;
}
