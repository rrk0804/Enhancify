import EndpointsBase from './EndpointsBase.js';
export default class BrowseEndpoints extends EndpointsBase {
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
//# sourceMappingURL=BrowseEndpoints.js.map