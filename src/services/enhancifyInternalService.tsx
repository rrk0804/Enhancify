import React from "react";
import RecommendedTrack from "../components/RecommendedTrack";
import { Labels, MetricFeatures, SongMetricData } from "../types/enhancify";
import { AudioFeaturesResponse, GetRecommendationsResponse } from "../types/spotify-web-api";

// Creates the recommended track view for any response from the Spotify recommendations endpoint
export function RecommendationsRender(recommendations : GetRecommendationsResponse | {}) {
  if (Object.keys(recommendations).length == 0) {
    return;
  }
  let recs = (recommendations as GetRecommendationsResponse)["tracks"];
  let recommendedTracksHTML = [];
  for (let i = 0; i < recs.length; i++) {
    let recommendedSong = <RecommendedTrack songCover={recs[i].album.images[0].url}
                                            songAlbum={recs[i].album.name}
                                            songName={recs[i].name}
                                            songArtists={recs[i].artists.map((artist) => artist.name)}
                                            songURI={recs[i].uri}
                                            key={i}>
                          </RecommendedTrack>;
    recommendedTracksHTML.push(recommendedSong);
  }
  return recommendedTracksHTML;
}

// Dynamically fills in the song metric information based on the specific metrics that the user wants to display
export function getSongMetrics(audioFeatures: AudioFeaturesResponse, metricsToDisplay: string[]): SongMetricData[] {
  let res: SongMetricData[] = [];
  for (const metric of metricsToDisplay) {
    res.push({
      title: metric,
      floatValue: audioFeatures[metric.toLowerCase() as keyof AudioFeaturesResponse],
      label: metric in metricFeatures.label ? metricFeatures.label[metric as keyof Labels] : "",
      progressBar: metricFeatures.progressbar.has(metric),
    });
  }
  return res;
}

// Object that represents which metrics require a progress bar and which metrics require a specific label
const metricFeatures: MetricFeatures = {
  progressbar: new Set(["Danceability", "Energy", "Acousticness", "Instrumentalness", "Speechiness", "Valence", "Liveness"]),
  label: {
    Loudness: "dB",
    Tempo: "bpm",
    Time_Signature: "/4",
    Key: "in Pitch Class",
    Mode: "(0: Minor, 1: Major)",
  }
};

// Array of all the metric types that we allow to be shown
export const allMetrics: string[] = ["Danceability", "Energy", "Acousticness", "Loudness", "Key", "Tempo", "Instrumentalness", "Liveness", "Mode", "Speechiness", "Time_Signature", "Valence"];
