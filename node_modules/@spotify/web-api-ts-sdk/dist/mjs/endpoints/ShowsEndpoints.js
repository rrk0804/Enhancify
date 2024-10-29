import EndpointsBase from './EndpointsBase.js';
export default class ShowsEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`shows/${idOrIds}${params}`);
        }
        // TODO: only returns 50, validate here
        const params = this.paramsFor({ ids: idOrIds, market });
        const response = await this.getRequest(`shows${params}`);
        return response.shows;
    }
    episodes(id, market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`shows/${id}/episodes${params}`);
    }
}
//# sourceMappingURL=ShowsEndpoints.js.map