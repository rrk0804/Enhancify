"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class ChaptersEndpoints extends EndpointsBase_js_1.default {
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
exports.default = ChaptersEndpoints;
//# sourceMappingURL=ChaptersEndpoints.js.map