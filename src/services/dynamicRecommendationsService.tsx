import { GetRecommendationsInput, GetRecommendationsResponse } from "../types/spotify-web-api";

async function getRecommendations(apiOptions: GetRecommendationsInput): Promise<GetRecommendationsResponse | {}> {
  let url = "https://api.spotify.com/v1/recommendations?";

  let queryParams: string[] = [];
  for (const [key, value] of Object.entries(apiOptions.data)) {
    if (!value) {
      continue;
    }
    queryParams.push(key + "=" + value);
  }
  url += queryParams.join("&");

  var accessToken = Spicetify.Platform.Session.accessToken;

  let response = await fetch(url,
      {
          headers: {
              Authorization: "Bearer " + accessToken,
          },
      }
  );

  return response.status == 200 ? await response.json() : {};
}

export default getRecommendations;
