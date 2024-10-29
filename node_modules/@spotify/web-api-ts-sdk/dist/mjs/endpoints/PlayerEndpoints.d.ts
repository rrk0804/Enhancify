import type { Devices, Market, MaxInt, PlaybackState, Queue, RecentlyPlayedTracksPage } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
interface QueryRange {
    timestamp: number;
    type: "before" | "after";
}
export default class PlayerEndpoints extends EndpointsBase {
    getPlaybackState(market?: Market, additional_types?: string): Promise<PlaybackState>;
    getAvailableDevices(): Promise<Devices>;
    getCurrentlyPlayingTrack(market?: Market, additional_types?: string): Promise<PlaybackState>;
    getRecentlyPlayedTracks(limit?: MaxInt<50>, queryRange?: QueryRange): Promise<RecentlyPlayedTracksPage>;
    getUsersQueue(): Promise<Queue>;
    transferPlayback(device_ids: string[], play?: boolean): Promise<void>;
    startResumePlayback(device_id: string, context_uri?: string, uris?: string[], offset?: object, positionMs?: number): Promise<void>;
    pausePlayback(device_id: string): Promise<void>;
    skipToNext(device_id: string): Promise<void>;
    skipToPrevious(device_id: string): Promise<void>;
    seekToPosition(position_ms: number, device_id?: string): Promise<void>;
    setRepeatMode(state: 'track' | 'context' | 'off', device_id?: string): Promise<void>;
    setPlaybackVolume(volume_percent: number, device_id?: string): Promise<void>;
    togglePlaybackShuffle(state: boolean, device_id?: string): Promise<void>;
    addItemToPlaybackQueue(uri: string, device_id?: string): Promise<void>;
}
export {};
