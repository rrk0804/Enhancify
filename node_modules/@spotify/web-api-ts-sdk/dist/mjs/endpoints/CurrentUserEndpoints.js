import EndpointsBase from './EndpointsBase.js';
export default class CurrentUserEndpoints extends EndpointsBase {
    albums;
    audiobooks;
    episodes;
    playlists;
    shows;
    tracks;
    constructor(api) {
        super(api);
        this.albums = new CurrentUserAlbumsEndpoints(api);
        this.audiobooks = new CurrentUserAudiobooksEndpoints(api);
        this.episodes = new CurrentUserEpisodesEndpoints(api);
        this.playlists = new CurrentUserPlaylistsEndpoints(api);
        this.shows = new CurrentUserShowsEndpoints(api);
        this.tracks = new CurrentUserTracksEndpoints(api);
    }
    profile() {
        return this.getRequest('me');
    }
    topItems(type, time_range, limit, offset) {
        const params = this.paramsFor({ time_range, limit, offset });
        return this.getRequest(`me/top/${type}${params}`);
    }
    followedArtists(after, limit) {
        const params = this.paramsFor({ type: "artist", after, limit });
        return this.getRequest(`me/following${params}`);
    }
    async followArtistsOrUsers(ids, type) {
        const params = this.paramsFor({ type });
        await this.putRequest(`me/following${params}`, { ids });
    }
    async unfollowArtistsOrUsers(ids, type) {
        const params = this.paramsFor({ type });
        await this.deleteRequest(`me/following${params}`, { ids });
    }
    followsArtistsOrUsers(ids, type) {
        const params = this.paramsFor({ ids, type });
        return this.getRequest(`me/following/contains${params}`);
    }
}
class CurrentUserAlbumsEndpoints extends EndpointsBase {
    savedAlbums(limit, offset, market) {
        const params = this.paramsFor({ limit, offset, market });
        return this.getRequest(`me/albums${params}`);
    }
    async saveAlbums(ids) {
        await this.putRequest('me/albums', ids);
    }
    async removeSavedAlbums(ids) {
        await this.deleteRequest('me/albums', ids);
    }
    hasSavedAlbums(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/albums/contains${params}`);
    }
}
class CurrentUserAudiobooksEndpoints extends EndpointsBase {
    savedAudiobooks(limit, offset) {
        const params = this.paramsFor({ limit, offset });
        return this.getRequest(`me/audiobooks${params}`);
    }
    async saveAudiobooks(ids) {
        await this.putRequest('me/audiobooks', ids);
    }
    async removeSavedAudiobooks(ids) {
        await this.deleteRequest('me/audiobooks', ids);
    }
    hasSavedAudiobooks(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/audiobooks/contains${params}`);
    }
}
class CurrentUserEpisodesEndpoints extends EndpointsBase {
    savedEpisodes(market, limit, offset) {
        const params = this.paramsFor({ market, limit, offset });
        return this.getRequest(`me/episodes${params}`);
    }
    async saveEpisodes(ids) {
        await this.putRequest(`me/episodes`, ids);
    }
    async removeSavedEpisodes(ids) {
        await this.deleteRequest(`me/episodes`, ids);
    }
    hasSavedEpisodes(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/episodes/contains${params}`);
    }
}
class CurrentUserPlaylistsEndpoints extends EndpointsBase {
    playlists(limit, offset) {
        const params = this.paramsFor({ limit, offset });
        return this.getRequest(`me/playlists${params}`);
    }
    async follow(playlist_id) {
        await this.putRequest(`playlists/${playlist_id}/followers`);
    }
    async unfollow(playlist_id) {
        await this.deleteRequest(`playlists/${playlist_id}/followers`);
    }
    isFollowing(playlistId, ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`playlists/${playlistId}/followers/contains${params}`);
    }
}
class CurrentUserShowsEndpoints extends EndpointsBase {
    savedShows(limit, offset) {
        const params = this.paramsFor({ limit, offset });
        return this.getRequest(`me/shows${params}`);
    }
    saveShows(ids) {
        const params = this.paramsFor({ ids });
        return this.putRequest(`me/shows${params}`);
    }
    removeSavedShows(ids, market) {
        const params = this.paramsFor({ ids, market });
        return this.deleteRequest(`me/shows${params}`);
    }
    hasSavedShow(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/shows/contains${params}`);
    }
}
class CurrentUserTracksEndpoints extends EndpointsBase {
    savedTracks(limit, offset, market) {
        const params = this.paramsFor({ limit, offset, market });
        return this.getRequest(`me/tracks${params}`);
    }
    async saveTracks(ids) {
        await this.putRequest('me/tracks', ids);
    }
    async removeSavedTracks(ids) {
        await this.deleteRequest('me/tracks', ids);
    }
    hasSavedTracks(ids) {
        const params = this.paramsFor({ ids });
        return this.getRequest(`me/tracks/contains${params}`);
    }
}
//# sourceMappingURL=CurrentUserEndpoints.js.map