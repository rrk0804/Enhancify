import type { CountryCodeA2, MaxInt, Categories, Category, NewReleases, FeaturedPlaylists } from '../types.js';
import EndpointsBase from './EndpointsBase.js';
export default class BrowseEndpoints extends EndpointsBase {
    getCategories(country?: CountryCodeA2, locale?: string, limit?: MaxInt<50>, offset?: number): Promise<Categories>;
    getCategory(categoryId: string, country?: CountryCodeA2, locale?: string): Promise<Category>;
    getNewReleases(country?: string, limit?: MaxInt<50>, offset?: number): Promise<NewReleases>;
    getFeaturedPlaylists(country?: CountryCodeA2, locale?: string, timestamp?: string, limit?: MaxInt<50>, offset?: number): Promise<FeaturedPlaylists>;
    getPlaylistsForCategory(category_id: string, country?: CountryCodeA2, limit?: MaxInt<50>, offset?: number): Promise<FeaturedPlaylists>;
}
