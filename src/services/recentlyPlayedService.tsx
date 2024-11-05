import type { GetRecentlyPlayedTracksResponse, GetRecentlyPlayedTracksInput, AudioFeaturesResponse } from "../types/spotify-web-api";
import getMultiTrackAudioFeatures from "./multiTrackAudioFeaturesService";
import type { HistoricalMetrics } from "../types/enhancify";

async function getRecentlyPlayedTracksMetrics(apiOptions: GetRecentlyPlayedTracksInput) : Promise<HistoricalMetrics | {}> {
    let url = "https://api.spotify.com/v1/me/player/recently-played";

    // Extract the query parameters from the API options input
    // to create a request string
    let queryParams: string[] = [];
    for (const [key, value] of Object.entries(apiOptions.data)) {
        if (!value) {
            continue;
        }
        queryParams.push(key + "=" + value);
    }
    url += queryParams.join("&");

    var accessToken = Spicetify.Platform.Session.accessToken;

    // Make the API request to get the recently
    // played songs
    let RecentlyPlayedTracksResponse = await fetch(url, 
        {
            headers: {
                Authorization: "Bearer " + accessToken,
            },

        }
    );
    
    // If the respone was not successfully retrieved,
    // then return an empty object
    if (RecentlyPlayedTracksResponse.status != 200) {
        return {};
    }

    // Get the musical characteristics of each song
    // Get all the song ids
    let songIDs: string[] = [];
    let RecentlyPlayedTracksResponseJSON = await RecentlyPlayedTracksResponse.json();
    for (let item of RecentlyPlayedTracksResponseJSON.items) {
        songIDs.push(item.track.id);
    }
    let audioFeatures = await getMultiTrackAudioFeatures(songIDs);

    // Process the audio features
    let relevantMetrics = ["acousticness", "danceability", "energy", "instrumentalness",
                           "liveness", "speechiness", "valence"];
    let metricsData: { [metric: string]: {total: number, count: number} } = {};
    for (let metric of relevantMetrics) {
        metricsData[metric] = {total: 0, count: 0};
    }
    for (let audioFeature of audioFeatures) {
        for (let feature of Object.keys(audioFeature)) {
            if (feature in relevantMetrics) {
                if (audioFeature[feature as keyof AudioFeaturesResponse]) {
                    metricsData[feature].total += parseInt(audioFeature[feature as keyof AudioFeaturesResponse]);
                    metricsData[feature].count += 1;
                }
            }
        }
    }

    // Average out the song metrics
    let result: HistoricalMetrics = {
        acousticness: {
            average: 0,
            count: 0
        },
        danceability: {
            average: 0,
            count: 0
        },
        energy: {
            average: 0,
            count: 0
        },
        instrumentalness: {
            average: 0,
            count: 0
        },
        liveness: {
            average: 0,
            count: 0
        },
        speechiness: {
            average: 0,
            count: 0
        },
        valence: {
            average: 0,
            count: 0
        }
    };
    for (let metric in Object.keys(metricsData)) {
        result[metric as keyof HistoricalMetrics].average = metricsData[metric].total / metricsData[metric].count;
        result[metric as keyof HistoricalMetrics].count = metricsData[metric].count;
    }

    return result;
}