import type { AudioFeaturesResponse } from "../types/spotify-web-api";

// Accept an array of songIDs directly
async function getMultiTrackAudioFeatures(songIDs: string[] | undefined): Promise<AudioFeaturesResponse[]> {
    if (!songIDs || songIDs.length === 0) {
        return [];
    }

    const accessToken = Spicetify.Platform.Session.accessToken;

    // Make multiple API requests using Promise.all to fetch audio features for each songID
    const responses = await Promise.all(
        songIDs.map(async (songID) => {
            let response = await fetch (
                "https://api.spotify.com/v1/audio-features/" + songID,
                {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );

            // Return the JSON response if the status is 200, else return null
            return response.status === 200 ? await response.json() : null;
        })
    );

    // Filter out any null values in case of failed requests
    return responses.filter((response) => response !== null) as AudioFeaturesResponse[];
}

export default getMultiTrackAudioFeatures;