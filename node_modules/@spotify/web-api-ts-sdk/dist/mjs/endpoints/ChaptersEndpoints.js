import EndpointsBase from './EndpointsBase.js';
export default class ChaptersEndpoints extends EndpointsBase {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`chapters/${idOrIds}${params}`);
        }
        // TODO: Only returns top 50, validate / pre-check here
        const params = this.paramsFor({ ids: idOrIds, market });
        const response = await this.getRequest(`chapters${params}`);
        return response.chapters;
    }
}
//# sourceMappingURL=ChaptersEndpoints.js.map