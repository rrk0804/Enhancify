"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class SearchEndpoints extends EndpointsBase_js_1.default {
    async execute(q, type, market, limit, offset, include_external) {
        const params = this.paramsFor({ q, type, market, limit, offset, include_external });
        return await this.getRequest(`search${params}`);
    }
}
exports.default = SearchEndpoints;
//# sourceMappingURL=SearchEndpoints.js.map