import EndpointsBase from './EndpointsBase.js';
export default class EpisodesEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`episodes/${idOrIds}${params}`);
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        const response = await this.getRequest(`episodes${params}`);
        return response.episodes;
    }
}
//# sourceMappingURL=EpisodesEndpoints.js.map