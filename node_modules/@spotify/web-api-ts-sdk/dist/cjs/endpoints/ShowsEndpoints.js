"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class ShowsEndpoints extends EndpointsBase_js_1.default {
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
exports.default = ShowsEndpoints;
//# sourceMappingURL=ShowsEndpoints.js.map