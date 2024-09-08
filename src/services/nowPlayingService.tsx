import type { AudioFeaturesResponse } from "../types/spotify-web-api";

async function getAudioFeatures(songURI: string | undefined): Promise<AudioFeaturesResponse | {}> {
    if (!songURI) {
        return {};
    }

    var accessToken = Spicetify.Platform.Session.accessToken;

    var songID = songURI.split(":")[2];
    let response = await fetch(
        "https://api.spotify.com/v1/audio-features/" + songID,
        {
            headers: {
                Authorization: "Bearer " + accessToken,
            },
        }
    );

    return response.status == 200 ? await response.json() : {};
}

export default getAudioFeatures;
