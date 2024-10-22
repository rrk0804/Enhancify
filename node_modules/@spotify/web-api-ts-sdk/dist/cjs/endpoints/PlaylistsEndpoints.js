"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EndpointsBase_js_1 = __importDefault(require("./EndpointsBase.js"));
class PlaylistsEndpoints extends EndpointsBase_js_1.default {
    getPlaylist(playlist_id, market, fields, additional_types) {
        // TODO: better support for fields
        const params = this.paramsFor({ market, fields, additional_types: additional_types?.join(',') });
        return this.getRequest(`playlists/${playlist_id}${params}`);
    }
    getPlaylistItems(playlist_id, market, fields, limit, offset, additional_types) {
        // TODO: better support for fields
        const params = this.paramsFor({ market, fields, limit, offset, additional_types: additional_types?.join(',') });
        return this.getRequest(`playlists/${playlist_id}/tracks${params}`);
    }
    async changePlaylistDetails(playlist_id, request) {
        await this.putRequest(`playlists/${playlist_id}`, request);
    }
    movePlaylistItems(playlist_id, range_start, range_length, moveToPosition) {
        return this.updatePlaylistItems(playlist_id, {
            range_start,
            range_length,
            insert_before: moveToPosition
        });
    }
    updatePlaylistItems(playlist_id, request) {
        return this.putRequest(`playlists/${playlist_id}/tracks`, request);
    }
    async addItemsToPlaylist(playlist_id, uris, position) {
        await this.postRequest(`playlists/${playlist_id}/tracks`, { position, uris: uris });
    }
    async removeItemsFromPlaylist(playlist_id, request) {
        await this.deleteRequest(`playlists/${playlist_id}/tracks`, request);
    }
    getUsersPlaylists(user_id, limit, offset) {
        const params = this.paramsFor({ limit, offset });
        return this.getRequest(`users/${user_id}/playlists${params}`);
    }
    createPlaylist(user_id, request) {
        return this.postRequest(`users/${user_id}/playlists`, request);
    }
    getPlaylistCoverImage(playlist_id) {
        return this.getRequest(`playlists/${playlist_id}/images`);
    }
    async addCustomPlaylistCoverImage(playlist_id, imageData) {
        let base64EncodedJpeg = "";
        if (imageData instanceof Buffer) {
            base64EncodedJpeg = imageData.toString("base64");
        }
        else if (imageData instanceof HTMLCanvasElement) {
            base64EncodedJpeg = imageData.toDataURL("image/jpeg").split(';base64,')[1];
        }
        else if (imageData instanceof HTMLImageElement) {
            const canvas = document.createElement("canvas");
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                throw new Error("Could not get canvas context");
            }
            ctx.drawImage(imageData, 0, 0);
            base64EncodedJpeg = canvas.toDataURL("image/jpeg").split(';base64,')[1];
        }
        else if (typeof imageData === "string") {
            base64EncodedJpeg = imageData;
        }
        else {
            throw new Error("ImageData must be a Buffer, HTMLImageElement, HTMLCanvasElement, or string containing a base64 encoded jpeg");
        }
        await this.addCustomPlaylistCoverImageFromBase64String(playlist_id, base64EncodedJpeg);
    }
    async addCustomPlaylistCoverImageFromBase64String(playlist_id, base64EncodedJpeg) {
        await this.putRequest(`playlists/${playlist_id}/images`, base64EncodedJpeg, "image/jpeg");
    }
}
exports.default = PlaylistsEndpoints;
//# sourceMappingURL=PlaylistsEndpoints.js.map