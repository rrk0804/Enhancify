import { Labels, MetricFeatures, SongMetricData } from "../types/enhancify";
import { AudioFeaturesResponse } from "../types/spotify-web-api";

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
    Key: "in Pitch Class notation",
    Mode: "(0: Minor, 1: Major)",
  }
};

// Array of all the metric types that we allow to be shown
export const allMetrics: string[] = ["Danceability", "Energy", "Acousticness", "Loudness", "Key", "Tempo", "Instrumentalness", "Liveness", "Mode", "Speechiness", "Time_Signature", "Valence"];
