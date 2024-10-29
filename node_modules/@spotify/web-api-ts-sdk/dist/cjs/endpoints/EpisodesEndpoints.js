"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class EpisodesEndpoints extends EndpointsBase_js_1.default {
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
exports.default = EpisodesEndpoints;
//# sourceMappingURL=EpisodesEndpoints.js.map