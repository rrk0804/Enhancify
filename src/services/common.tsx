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
    // return [
    //   {
    //     title: "Danceability",
    //     floatValue: (audioFeatures as AudioFeaturesResponse)["danceability"],
    //     label: "",
    //     progressBar: true
    //   },
    //   {
    //     title: "Energy",
    //     floatValue: (audioFeatures as AudioFeaturesResponse)["energy"],
    //     label: "",
    //     progressBar: true
    //   },
    //   {
    //     title: "Acousticness",
    //     floatValue: (audioFeatures as AudioFeaturesResponse)["acousticness"],
    //     label: "",
    //     progressBar: true
    //   },
    //   {
    //     title: "Loudness",
    //     floatValue: (audioFeatures as AudioFeaturesResponse)["loudness"],
    //     label: "dB",
    //     progressBar: false
    //   },
    //   {
    //     title: "Key",
    //     floatValue: (audioFeatures as AudioFeaturesResponse)["key"],
    //     label: "",
    //     progressBar: false
    //   },
    //   {
    //     title: "Tempo",
    //     floatValue: (audioFeatures as AudioFeaturesResponse)["tempo"],
    //     label: "",
    //     progressBar: false
    //   },
    // ];
}

const metricFeatures: MetricFeatures = {
  progressbar: new Set(["Danceability", "Energy", "Acousticness"]),
  label: {
    Loudness: "dB"
  }
}

export default getID;
