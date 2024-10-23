"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class BrowseEndpoints extends EndpointsBase_js_1.default {
    getCategories(country, locale, limit, offset) {
        const params = this.paramsFor({ country, locale, limit, offset });
        return this.getRequest(`browse/categories${params}`);
    }
    getCategory(categoryId, country, locale) {
        const params = this.paramsFor({ country, locale });
        return this.getRequest(`browse/categories/${categoryId}${params}`);
    }
    getNewReleases(country, limit, offset) {
        const params = this.paramsFor({ country, limit, offset });
        return this.getRequest(`browse/new-releases${params}`);
    }
    getFeaturedPlaylists(country, locale, timestamp, limit, offset) {
        const params = this.paramsFor({ country, locale, timestamp, limit, offset });
        return this.getRequest(`browse/featured-playlists${params}`);
    }
    getPlaylistsForCategory(category_id, country, limit, offset) {
        const params = this.paramsFor({ country, limit, offset });
        return this.getRequest(`browse/categories/${category_id}/playlists${params}`);
    }
}
exports.default = BrowseEndpoints;
//# sourceMappingURL=BrowseEndpoints.js.map