import type { Market, Audiobook, MaxInt, Page, SimplifiedChapter } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class AudiobooksEndpoints extends EndpointsBase {
    get(id: string, market?: Market): Promise<Audiobook>;
    get(ids: string[], market?: Market): Promise<Audiobook[]>;
    getAudiobookChapters(id: string, market?: Market, limit?: MaxInt<50>, offset?: number): Promise<Page<SimplifiedChapter>>;
}
