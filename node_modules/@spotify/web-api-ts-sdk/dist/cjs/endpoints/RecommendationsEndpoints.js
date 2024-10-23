"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class RecommendationsEndpoints extends EndpointsBase_js_1.default {
    get(request) {
        const params = this.paramsFor(request);
        return this.getRequest(`recommendations${params}`);
    }
    genreSeeds() {
        return this.getRequest('recommendations/available-genre-seeds');
    }
}
exports.default = RecommendationsEndpoints;
//# sourceMappingURL=RecommendationsEndpoints.js.map