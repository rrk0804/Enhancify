import { Labels, MetricFeatures, SongMetricData } from "../types/enhancify";
import { AudioFeaturesResponse } from "../types/spotify-web-api";

function getID(uri: string): string {
  return uri.split(":")[2];
}

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

const metricFeatures: MetricFeatures = {
  progressbar: new Set(["Danceability", "Energy", "Acousticness"]),
  label: {
    Loudness: "dB",
    Tempo: "bpm",
  }
}

export default getID;
