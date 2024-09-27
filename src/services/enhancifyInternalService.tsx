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
  progressbar: new Set(["Danceability", "Energy", "Acousticness"]),
  label: {
    Loudness: "dB",
    Tempo: "bpm",
  }
};
