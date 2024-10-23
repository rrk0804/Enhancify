import type { Chapter } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export type ChapterMarket = "GB" | "US" | "IE" | "NZ" | "AU";
export default class ChaptersEndpoints extends EndpointsBase {
    get(id: string, market: ChapterMarket): Promise<Chapter>;
    get(ids: string[], market: ChapterMarket): Promise<Chapter[]>;
}
