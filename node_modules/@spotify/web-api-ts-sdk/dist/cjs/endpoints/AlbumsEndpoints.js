"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class AlbumsEndpoints extends EndpointsBase_js_1.default {
    async get(idOrIds, market) {
        if (typeof idOrIds === 'string') {
            const params = this.paramsFor({ market });
            const album = await this.getRequest(`albums/${idOrIds}${params}`);
            return album;
        }
        const params = this.paramsFor({ ids: idOrIds, market });
        // TODO: only returns top 20, validate here
        const response = await this.getRequest(`albums${params}`);
        return response.albums;
    }
    tracks(albumId, market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`albums/${albumId}/tracks${params}`);
    }
}
exports.default = AlbumsEndpoints;
//# sourceMappingURL=AlbumsEndpoints.js.map