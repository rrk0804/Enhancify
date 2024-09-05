async function getPlaylistTrackIDs(playlistID: string): Promise<string[]> {
    // If playlistID is undefined or empty, return an empty array
    if (!playlistID) {
        return [];
    }

    // Retrieve access token from Spicetify Platform
    const accessToken = Spicetify.Platform.Session.accessToken;

    // Initialize an empty array to store track IDs
    let trackIDs: string[] = [];
    let nextURL: string | null = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

    // Loop to handle pagination in case of playlists with more than 100 tracks
    while (nextURL) {
        // Fetch the playlist tracks data
        const response = await fetch(nextURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status !== 200) {
            // If the response fails, return the trackIDs collected so far (or empty array if first call)
            return [];
        }

        const data = await response.json();

        // Extract the track IDs from the fetched data
        const ids = data.items.map((item: any) => item.track.id);
        trackIDs = trackIDs.concat(ids);

        // Check if there's another page of results, otherwise set nextURL to null to end the loop
        nextURL = data.next;
    }

    return trackIDs;
}

export default getPlaylistTrackIDs;
