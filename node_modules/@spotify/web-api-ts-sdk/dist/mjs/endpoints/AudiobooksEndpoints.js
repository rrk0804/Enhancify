import EndpointsBase from './EndpointsBase.js';
export default class AudiobooksEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`audiobooks/${idOrIds}${params}`);
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        const response = await this.getRequest(`audiobooks${params}`);
        return response.audiobooks;
    }
    getAudiobookChapters(id, market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`audiobooks/${id}/chapters${params}`);
    }
}
//# sourceMappingURL=AudiobooksEndpoints.js.map