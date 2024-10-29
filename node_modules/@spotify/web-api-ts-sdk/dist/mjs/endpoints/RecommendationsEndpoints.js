import EndpointsBase from './EndpointsBase.js';
export default class RecommendationsEndpoints extends EndpointsBase {
    get(request) {
        const params = this.paramsFor(request);
        return this.getRequest(`recommendations${params}`);
    }
    genreSeeds() {
        return this.getRequest('recommendations/available-genre-seeds');
    }
}
//# sourceMappingURL=RecommendationsEndpoints.js.map