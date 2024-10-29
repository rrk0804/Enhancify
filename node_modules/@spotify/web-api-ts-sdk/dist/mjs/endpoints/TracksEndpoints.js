import EndpointsBase from './EndpointsBase.js';
export default class TracksEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`tracks/${idOrIds}${params}`);
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        // TODO: only returns top 20, validate here
        const response = await this.getRequest(`tracks${params}`);
        return response.tracks;
    }
    async audioFeatures(idOrIds) {
        if (typeof idOrIds === 'string') {
            return this.getRequest(`audio-features/${idOrIds}`);
        }
        const params = this.paramsFor({ ids: idOrIds });
        const response = await this.getRequest(`audio-features${params}`);
        return response.audio_features;
    }
    audioAnalysis(id) {
        return this.getRequest(`audio-analysis/${id}`);
    }
}
//# sourceMappingURL=TracksEndpoints.js.map