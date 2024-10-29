export class Scopes {
    static get playlist() {
        return [
            ...Scopes.playlistRead,
            ...Scopes.playlistModify
        ];
    }
    static get playlistRead() {
        return [
            "playlist-read-private",
            "playlist-read-collaborative",
        ];
    }
    static get playlistModify() {
        return [
            "playlist-modify-public",
            "playlist-modify-private",
            "ugc-image-upload"
        ];
    }
    static get userDetails() {
        return [
            "user-read-private",
            "user-read-email",
        ];
    }
    static get userLibrary() {
        return [
            ...Scopes.userLibraryRead,
            ...Scopes.userLibraryModify
        ];
    }
    static get userLibraryRead() {
        return [
            "user-library-read",
        ];
    }
    static get userLibraryModify() {
        return [
            "user-library-modify",
        ];
    }
    static get userRecents() {
        return [
            "user-top-read",
            "user-read-recently-played",
        ];
    }
    static get userFollow() {
        return [
            ...Scopes.userFollowRead,
            ...Scopes.userFollowModify
        ];
    }
    static get userFollowRead() {
        return [
            "user-follow-read",
        ];
    }
    static get userFollowModify() {
        return [
            "user-follow-modify",
        ];
    }
    static get userPlayback() {
        return [
            ...Scopes.userPlaybackRead,
            ...Scopes.userPlaybackModify
        ];
    }
    static get userPlaybackRead() {
        return [
            "user-read-playback-position",
            "user-read-playback-state",
            "user-read-currently-playing",
        ];
    }
    static get userPlaybackModify() {
        return [
            "user-modify-playback-state",
            "app-remote-control",
            "streaming"
        ];
    }
    static get all() {
        return [
            ...Scopes.userDetails,
            ...Scopes.playlist,
            ...Scopes.userLibrary,
            ...Scopes.userRecents,
            ...Scopes.userFollow,
            ...Scopes.userPlayback,
        ];
    }
}
//# sourceMappingURL=Scopes.js.map