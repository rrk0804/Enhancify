"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class TracksEndpoints extends EndpointsBase_js_1.default {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            return this.getRequest(`tracks/${idOrIds}${params}`);
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        // TODO: only returns top 20, validate here
        const response = await this.getRequest(`tracks${params}`);
        return response.tracks;
    }
    async audioFeatures(idOrIds) {
        if (typeof idOrIds === 'string') {
            return this.getRequest(`audio-features/${idOrIds}`);
        }
        const params = this.paramsFor({ ids: idOrIds });
        const response = await this.getRequest(`audio-features${params}`);
        return response.audio_features;
    }
    audioAnalysis(id) {
        return this.getRequest(`audio-analysis/${id}`);
    }
}
exports.default = TracksEndpoints;
//# sourceMappingURL=TracksEndpoints.js.map