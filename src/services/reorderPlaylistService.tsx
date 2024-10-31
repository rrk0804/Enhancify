export default async function reorderPlaylist(playlistID: string, sortedTrackURIs: string[]): Promise<any> {
    if (!playlistID || !sortedTrackURIs.length) {
        console.error('No playlist ID or sorted tracks provided.');
        return;
    }

    const accessToken = Spicetify.Platform.Session.accessToken;
    const uri = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

    // Make the PUT request to reorder the playlist
    const response = await fetch(uri, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uris: sortedTrackURIs,
        }),
    });

    if (response.ok) {
        console.log('Playlist successfully reordered!');
        return response.json();
    } else {
        console.error('Failed to reorder playlist:', response.status, response.statusText);
    }
}
