import type { Market, Track, AudioFeatures, AudioAnalysis } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class TracksEndpoints extends EndpointsBase {
    get(id: string, market?: Market): Promise<Track>;
    get(ids: string[], market?: Market): Promise<Track[]>;
    audioFeatures(id: string): Promise<AudioFeatures>;
    audioFeatures(ids: string[]): Promise<AudioFeatures[]>;
    audioAnalysis(id: string): Promise<AudioAnalysis>;
}
