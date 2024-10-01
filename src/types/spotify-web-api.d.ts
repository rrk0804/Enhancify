export type AudioFeaturesResponse = {
  acousticness: string,
  analysis_url: string,
  danceability: string,
  duration_ms: string,
  energy: string,
  id: string,
  instrumentalness: string,
  key: string,
  liveness: string,
  loudness: string,
  mode: string,
  speechiness: string,
  tempo: string,
  time_signature: string,
  track_href: string,
  type: string,
  uri: string,
  valence: string
};

export class GetRecommendationsInput {
  data = new RecommendationsInput();
};

export class RecommendationsInput {
  limit = "6";
  market = "";
  seed_artists = "";
  seed_genres = "";
  seed_tracks = "";
  min_acousticness = "";
  max_acousticness = "";
  target_acousticness = "";
  min_danceability = "";
  max_danceability = "";
  target_danceability = "";
  min_duration_ms = "";
  max_duration_ms = "";
  target_duration_ms = "";
  min_energy = "";
  max_energy = "";
  target_energy = "";
  min_instrumentalness = "";
  max_instrumentalness = "";
  target_instrumentalness = "";
  min_key = "";
  max_key = "";
  target_key = "";
  min_liveness = "";
  max_liveness = "";
  target_liveness = "";
  min_loudness = "";
  max_loudness = "";
  target_loudness = "";
  min_mode = "";
  max_mode = "";
  target_mode = "";
  min_popularity = "";
  max_popularity = "";
  target_popularity = "";
  min_speechiness = "";
  max_speechiness = "";
  target_speechiness = "";
  min_tempo = "";
  max_tempo = "";
  target_tempo = "";
  min_time_signature = "";
  max_time_signature = "";
  target_time_signature = "";
  min_valence = "";
  max_valence = "";
  target_valence = "";
};

export type GetRecommendationsResponse = {
  seeds:
    {
      afterFilteringSize: number,
      afterRelinkingSize: number,
      href: string,
      id: string,
      initialPoolSize: number,
      type: string
    }[],
  tracks:
    {
      album: {
        album_type: string,
        total_tracks: number,
        available_markets: string[],
        external_urls: {
          spotify: string
        },
        href: string,
        id: string,
        images:
          {
            url: string,
            height: number,
            width: number,
          }[],
        name: string,
        release_date: string,
        release_date_precision: string,
        restrictions: {
          reason: string,
        },
        type: string,
        uri: string,
        artists:
          {
            external_urls: {
              spotify: string
            },
            href: string,
            id: string,
            name: string,
            type: string,
            uri: string
          }[]
      },
      artists:
        {
          external_urls: {
            spotify: string
          },
          href: string,
          id: string,
          name: string,
          type: string,
          uri: string
        }[],
      available_markets:
        string[],
      disc_number: number,
      duration_ms: number,
      explicit: boolean,
      external_ids: {
        isrc: string,
        ean: string,
        upc: string
      },
      external_urls: {
        spotify: string
      },
      href: string,
      id: string,
      is_playable: boolean,
      linked_from: {},
      restrictions: {
        reason: string
      },
      name: string,
      popularity: number,
      preview_url: string,
      track_number: number,
      type: string,
      uri: string,
      is_local: boolean
    }[]
};
