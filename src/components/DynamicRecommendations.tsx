import styles from "../css/app.module.scss";
import React from "react";
import getRecommendations from "../services/dynamicRecommendationsService";
import { GetRecommendationsInput, GetRecommendationsResponse } from "../types/spotify-web-api.d";
import getID from './../services/common';

class DynamicRecommendations extends React.Component<{}, {songQueue: Array<string>, artistQueue: Array<string>, recTarget: string, recommendations: GetRecommendationsResponse | {}}> {
  state = {
    songQueue: Spicetify.LocalStorage.get("songQueue")?.split(',') || new Array<string>,
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
      apiOptions.data.seed_tracks = this.state.songQueue.toString();
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
    if (this.state.songQueue && this.state.songQueue[this.state.songQueue.length-1] == curSongID) {
      return;
    }

    let newQueue = this.state.songQueue.slice();
    if (newQueue.includes(curSongID)) {
      newQueue = newQueue.filter((val, ind) => val != curSongID);
    }

    newQueue.push(curSongID);
    if (newQueue.length > 5) {
      newQueue.shift();
    }

    this.setState({
      songQueue: newQueue,
    }, () => {
      if (Spicetify.LocalStorage.get("songQueue") == this.state.songQueue.toString()) {
        return;
      }
      Spicetify.LocalStorage.set("songQueue", this.state.songQueue.toString());
      if (this.state.recTarget == "songs") {
        this.generateRecommendations();
      }
    });
  };

  shouldArtistQueueBeUpdated = (): boolean => {
    if (!Spicetify.Player.data.item.artists) {
      return false;
    }
    if (!this.state.artistQueue) {
      return true;
    }

    for (const artist of Spicetify.Player.data.item.artists) {
      let fromIndex = Math.max(0, this.state.artistQueue.length - Spicetify.Player.data.item.artists.length);
      if (!this.state.artistQueue.includes(getID(artist.uri), fromIndex)) {
        return true;
      };
    }

    return false;
  };

  setArtistQueue = () => {
    if (!Spicetify.Player.data.item.artists || !this.shouldArtistQueueBeUpdated()) {
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
          {"songQueue: " + String(this.state.songQueue) + "\n"}
          {"artistQueue: " + String(this.state.artistQueue) + "\n"}
          {JSON.stringify(Object.keys(this.state.recommendations).length != 0 ? (this.state.recommendations as GetRecommendationsResponse)["tracks"][0].name : {})}
        </text>
      </>
    );
  }
}

export default DynamicRecommendations
