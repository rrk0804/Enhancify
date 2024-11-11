export default async function reorderPlaylist(playlistID: string, sortedTrackURIs: string[]): Promise<any> {
    if (!playlistID || !sortedTrackURIs.length) {
        console.error('No playlist ID or sorted tracks provided.');
        return;
    }

    const uri = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

    const chunks = [];
    const chunkSize = 100;
    for (let i = 0; i < sortedTrackURIs.length; i += chunkSize) {
        chunks.push(sortedTrackURIs.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
        // Make DELETE request to delete the tracks that will be pushed again
        await PlaylistAPICall("DELETE", uri, chunk);

        // Make POST request to add the new order
        await PlaylistAPICall("POST", uri, chunk);
    }
}

async function PlaylistAPICall(requestType: string, uri: string, chunk: string[]) {
    const accessToken = Spicetify.Platform.Session.accessToken;

    let trackURIs = [];
    if (requestType == "DELETE") {
        for (const songURI of chunk) {
            trackURIs.push({
                uri: songURI
            });
        }
    }

    let response = await fetch(uri, {
        method: requestType,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestType == "POST" ? {
            uris: chunk
        } : {
            tracks: trackURIs
        }),
    });

    if (response.status == 200) {
        console.log(requestType, ' playlist API call successful!');
    } else {
        console.error('Failed ', requestType, ' playlist API call: ', response.status, response.statusText);
    }
}
