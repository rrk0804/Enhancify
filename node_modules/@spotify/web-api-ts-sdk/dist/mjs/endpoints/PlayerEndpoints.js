import EndpointsBase from './EndpointsBase.js';
export default class PlayerEndpoints extends EndpointsBase {
    getPlaybackState(market, additional_types) {
        const params = this.paramsFor({ market, additional_types });
        return this.getRequest(`me/player${params}`);
    }
    getAvailableDevices() {
        return this.getRequest('me/player/devices');
    }
    getCurrentlyPlayingTrack(market, additional_types) {
        const params = this.paramsFor({ market, additional_types });
        return this.getRequest(`me/player/currently-playing${params}`);
    }
    getRecentlyPlayedTracks(limit, queryRange) {
        const paramObj = { limit };
        if (queryRange) {
            if (queryRange.type === "before") {
                paramObj.before = queryRange.timestamp;
            }
            else if (queryRange.type === "after") {
                paramObj.after = queryRange.timestamp;
            }
        }
        const params = this.paramsFor(paramObj);
        return this.getRequest(`me/player/recently-played${params}`);
    }
    getUsersQueue() {
        return this.getRequest('me/player/queue');
    }
    async transferPlayback(device_ids, play) {
        if (device_ids.length > 1) {
            throw new Error("Although an array is accepted, only a single device_id is currently supported. Supplying more than one will return 400 Bad Request");
        }
        await this.putRequest('me/player', { device_ids, play });
    }
    async startResumePlayback(device_id, context_uri, uris, offset, positionMs) {
        const params = this.paramsFor({ device_id });
        await this.putRequest(`me/player/play${params}`, { context_uri, uris, offset, positionMs });
    }
    async pausePlayback(device_id) {
        const params = this.paramsFor({ device_id });
        await this.putRequest(`me/player/pause${params}`);
    }
    async skipToNext(device_id) {
        const params = this.paramsFor({ device_id });
        await this.postRequest(`me/player/next${params}`);
    }
    async skipToPrevious(device_id) {
        const params = this.paramsFor({ device_id });
        await this.postRequest(`me/player/previous${params}`);
    }
    async seekToPosition(position_ms, device_id) {
        const params = this.paramsFor({ position_ms, device_id });
        await this.putRequest(`me/player/seek${params}`);
    }
    async setRepeatMode(state, device_id) {
        const params = this.paramsFor({ state, device_id });
        await this.putRequest(`me/player/repeat${params}`);
    }
    async setPlaybackVolume(volume_percent, device_id) {
        const params = this.paramsFor({ volume_percent, device_id });
        await this.putRequest(`me/player/volume${params}`);
    }
    async togglePlaybackShuffle(state, device_id) {
        const params = this.paramsFor({ state, device_id });
        await this.putRequest(`me/player/shuffle${params}`);
    }
    async addItemToPlaybackQueue(uri, device_id) {
        const params = this.paramsFor({ uri, device_id });
        await this.postRequest(`me/player/queue${params}`);
    }
}
//# sourceMappingURL=PlayerEndpoints.js.map