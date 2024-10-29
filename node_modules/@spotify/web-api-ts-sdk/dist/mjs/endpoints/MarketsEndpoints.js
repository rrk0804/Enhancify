import EndpointsBase from './EndpointsBase.js';
export default class MarketsEndpoints extends EndpointsBase {
    getAvailableMarkets() {
        return this.getRequest('markets');
    }
}
//# sourceMappingURL=MarketsEndpoints.js.map