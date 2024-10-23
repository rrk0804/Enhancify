import EndpointsBase from './EndpointsBase.js';
export default class SearchEndpoints extends EndpointsBase {
    async execute(q, type, market, limit, offset, include_external) {
        const params = this.paramsFor({ q, type, market, limit, offset, include_external });
        return await this.getRequest(`search${params}`);
    }
}
//# sourceMappingURL=SearchEndpoints.js.map