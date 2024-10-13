import type { AudioFeaturesResponse } from "../types/spotify-web-api";

// Accept an array of songIDs directly
async function getMultiTrackAudioFeatures(songIDs: string[]): Promise<AudioFeaturesResponse[]> {
    if (!songIDs || songIDs.length === 0) {
        return [];
    }

    const accessToken = Spicetify.Platform.Session.accessToken;
    let allAudioFeatures: AudioFeaturesResponse[] = [];

    // Split the songIDs array into chunks of up to 100 IDs each
    const chunks = [];
    const chunkSize = 100;
    for (let i = 0; i < songIDs.length; i += chunkSize) {
        chunks.push(songIDs.slice(i, i + chunkSize));
    }

    // Fetch audio features for each chunk of songIDs
    for (const chunk of chunks) {
        const idsString = chunk.join(',');
        const response = await fetch(
            `https://api.spotify.com/v1/audio-features?ids=${idsString}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (response.status === 200) {
            const data = await response.json();
            if (data && data.audio_features) {
                allAudioFeatures = allAudioFeatures.concat(data.audio_features.filter(Boolean));
            }
        } else {
            console.error("Failed to fetch audio features for chunk:", chunk);
        }
    }

    return allAudioFeatures;
}

export default getMultiTrackAudioFeatures;
