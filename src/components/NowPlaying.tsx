import styles from "../css/app.module.scss";
import React from "react";
import getAudioFeatures from "../services/nowPlayingService";
import AudioFeaturesResponse from "../types/spotify-web-api";

class NowPlaying extends React.Component<{}, {audioFeatures: AudioFeaturesResponse | {}, songURI: string}> {
  state = {
    audioFeatures: {},
    songURI: "",
  }

  componentDidMount = () => {
    this.setAudioFeatures();
  }
  
  setAudioFeatures = () => {
    if (Spicetify.Player.data == null) {
      return;
    }
    if (this.state.songURI == Spicetify.Player.data.item.uri) {
      return;
    }
    this.state.songURI = Spicetify.Player.data.item.uri;

    const apiCall = async () => {
      var currentAudioFeatures = await getAudioFeatures(this.state.songURI || "");
      this.setState({
        audioFeatures: currentAudioFeatures,
      });
    }

    apiCall();
  }
 
  render() {
    Spicetify.Player.addEventListener("songchange", this.setAudioFeatures);
    return (
      <>
        <text className={styles.text}>
          {JSON.stringify(this.state.audioFeatures)}
        </text>
      </>
    );
  }
}

export default NowPlaying;
