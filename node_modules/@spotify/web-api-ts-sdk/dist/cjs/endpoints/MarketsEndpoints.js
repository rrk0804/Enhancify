"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class MarketsEndpoints extends EndpointsBase_js_1.default {
    getAvailableMarkets() {
        return this.getRequest('markets');
    }
}
exports.default = MarketsEndpoints;
//# sourceMappingURL=MarketsEndpoints.js.map