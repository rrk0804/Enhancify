export type SongMetricData = {
  title: string,
  floatValue: string,
  label: string,
  progressBar: boolean
};

export type Labels = {
  Loudness: string,
  Tempo: string,
  Time_Signature: string,
  Key: string,
  Mode: string
};

export type MetricFeatures = {
  progressbar: Set<string>,
  label: Labels
};

export type SelectedMetrics = {
  [metric: string]: string
};
