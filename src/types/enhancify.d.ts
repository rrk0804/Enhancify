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

export type HistoricalMetrics = {
  acousticness: {
    average: number, 
    count: number
  }, 
  danceability: {
    average: number, 
    count: number
  }, 
  energy: {
    average: number, 
    count: number
  }, 
  instrumentalness: {
    average: number, 
    count: number
  }, 
  liveness: {
    average: number, 
    count: number
  }, 
  speechiness: {
    average: number, 
    count: number
  }, 
  valence: {
    average: number, 
    count: number
  }
}