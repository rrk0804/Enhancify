import EndpointsBase from './EndpointsBase.js';
export default class AlbumsEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            const album = await this.getRequest(`albums/${idOrIds}${params}`);
            return album;
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        // TODO: only returns top 20, validate here
        const response = await this.getRequest(`albums${params}`);
        return response.albums;
    }
    tracks(albumId, market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`albums/${albumId}/tracks${params}`);
    }
}
//# sourceMappingURL=AlbumsEndpoints.js.map