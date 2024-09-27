export type SongMetricData = {
  title: string,
  floatValue: string,
  label: string,
  progressBar: boolean
};

export type Labels = {
  Loudness: string
  Tempo: string
}

export type MetricFeatures = {
  progressbar: Set<string>,
  label: Labels
};
