import styles from "../css/app.module.scss";
import React from "react";
import getRecommendations from "../services/dynamicRecommendationsService";
import { GetRecommendationsInput, GetRecommendationsResponse } from "../types/spotify-web-api.d";
import getID from './../services/common';

class DynamicRecommendations extends React.Component<{}, {queue: Array<string>, artistQueue: Array<string>, recTarget: string, recommendations: GetRecommendationsResponse | {}}> {
  state = {
    queue: Spicetify.LocalStorage.get("queue")?.split(',') || new Array<string>,
    artistQueue: Spicetify.LocalStorage.get("artistQueue")?.split(',') || new Array<string>,
    recTarget: "artists",
    recommendations: {},
  }

  componentDidMount = () => {
    this.generateRecommendations();
  }

  generateRecommendations = async () => {
    let apiOptions = new GetRecommendationsInput();
    if (this.state.recTarget == "songs") {
      apiOptions.data.seed_tracks = this.state.queue.toString();
    }
    else if (this.state.recTarget == "artists") {
      apiOptions.data.seed_artists = this.state.artistQueue.toString(); 
    }

    var recommendations = await getRecommendations(apiOptions);
    this.setState({
      recommendations: recommendations,
    });
  };
  
  addToQueue = (event?: Event & {data: number}) => {
    if (!event || !Spicetify.Player.data) {
      return;
    }

    let progressPercentage = (event.data / Spicetify.Player.data.item.duration.milliseconds) * 100;
    if (progressPercentage < 50) {
      return;
    }

    this.setSongQueue();
    this.setArtistQueue();
  };

  setSongQueue = () => {
    let curSongID = getID(Spicetify.Player.data.item.uri);
    if (this.state.queue && this.state.queue[this.state.queue.length-1] == curSongID) {
      return;
    }

    let newQueue = this.state.queue.slice();
    if (newQueue.includes(curSongID)) {
      newQueue = newQueue.filter((val, ind) => val != curSongID);
    }

    newQueue.push(curSongID);
    if (newQueue.length > 5) {
      newQueue.shift();
    }

    this.setState({
      queue: newQueue,
    }, () => {
      if (Spicetify.LocalStorage.get("queue") == this.state.queue.toString()) {
        return;
      }
      Spicetify.LocalStorage.set("queue", this.state.queue.toString());
      if (this.state.recTarget == "songs") {
        this.generateRecommendations();
      }
    });
  };

  setArtistQueue = () => {
    if (!Spicetify.Player.data.item.artists) {
      return;
    }

    let cont = false;
    if (this.state.artistQueue) {
      for (const artist of Spicetify.Player.data.item.artists) {
        let fromIndex = this.state.artistQueue.length >= Spicetify.Player.data.item.artists.length ? this.state.artistQueue.length - Spicetify.Player.data.item.artists.length : 0;
        if (!this.state.artistQueue.includes(getID(artist.uri), fromIndex)) {
          cont = true;
          break;
        };
      }
    }
    if (!cont) {
      return;
    }

    let newArtistQueue = this.state.artistQueue.slice();
    for (const artist of Spicetify.Player.data.item.artists) {
      let artistID = getID(artist.uri);
      if (newArtistQueue.includes(artistID)) {
        newArtistQueue = newArtistQueue.filter((val, ind) => val != artistID);
      }
      newArtistQueue.push(artistID);
    }

    while (newArtistQueue.length > 5) {
      newArtistQueue.shift();
    }

    this.setState({
      artistQueue: newArtistQueue,
    }, () => {
      if (Spicetify.LocalStorage.get("artistQueue") == this.state.artistQueue.toString()) {
        return;
      }
      Spicetify.LocalStorage.set("artistQueue", this.state.artistQueue.toString());
      if (this.state.recTarget == "artists") {
        this.generateRecommendations();
      }
    });
  };

  render() {
    Spicetify.Player.addEventListener("onprogress", this.addToQueue);
    return (
      <>
        <text className={styles.text}>
          {"songQueue: " + String(this.state.queue) + "\n"}
          {"artistQueue: " + String(this.state.artistQueue) + "\n"}
          {JSON.stringify(Object.keys(this.state.recommendations).length != 0 ? (this.state.recommendations as GetRecommendationsResponse)["tracks"][0].name : {})}
        </text>
      </>
    );
  }
}

export default DynamicRecommendations
