"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class ArtistsEndpoints extends EndpointsBase_js_1.default {
    async get(idOrIds) {
        if (typeof idOrIds === "string") {
            const artist = this.getRequest(`artists/${idOrIds}`);
            return artist;
        }
        const params = this.paramsFor({ ids: idOrIds });
        const response = await this.getRequest(`artists${params}`);
        return response.artists;
    }
    albums(id, includeGroups, market, limit, offset) {
        const params = this.paramsFor({
            include_groups: includeGroups,
            market,
            limit,
            offset,
        });
        return this.getRequest(`artists/${id}/albums${params}`);
    }
    topTracks(id, market) {
        // BUG: market is flagged as optional in the docs, but it's actually required for this endpoint
        // otherwise you get a 400
        const params = this.paramsFor({ market });
        return this.getRequest(`artists/${id}/top-tracks${params}`);
    }
    relatedArtists(id) {
        return this.getRequest(`artists/${id}/related-artists`);
    }
}
exports.default = ArtistsEndpoints;
//# sourceMappingURL=ArtistsEndpoints.js.map