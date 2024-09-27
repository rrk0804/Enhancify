import styles from "../css/app.module.scss";
import React from "react";
import getAudioFeatures from "../services/nowPlayingService";
import { AudioFeaturesResponse } from "../types/spotify-web-api";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import DynamicRecommendations from "./DynamicRecommendations";

class NowPlaying extends React.Component<{}, {audioFeatures: AudioFeaturesResponse | {}, 
                                              songURI: string, 
                                              recTarget: string}> {
  
  state = {
    audioFeatures: {},  // Features of the currently playing song (name, artist, stats)
    songURI: "",        // URI of the currently playing song
    recTarget: "songs", // Recommendations based on either songs or artist
  }

  componentDidMount = () => {
    this.setAudioFeatures();
  }
  
  setAudioFeatures = () => {

    // Check if there is no currently playing song or 
    // if the info of the song is currently being displayed
    if (!Spicetify.Player.data || this.state.songURI == Spicetify.Player.data.item.uri) {
      return;
    }

    this.state.songURI = Spicetify.Player.data.item.uri;

    // API call for getting song info
    const apiCall = async () => {
      const currentAudioFeatures = await getAudioFeatures(this.state.songURI || "");
      this.setState({
        audioFeatures: currentAudioFeatures,
      });
    }

    // Make the API call
    apiCall();
  }

  // Change the recommendation target
  changeRecTarget = () => {
    if (this.state.recTarget == "songs") {
      this.setState({
        recTarget: "artists",
      });
    }
    else if (this.state.recTarget == "artists") {
      this.setState({
        recTarget: "songs",
      });
    }
  };

  render() {

    Spicetify.Player.addEventListener("songchange", this.setAudioFeatures);

    return (
      <> 
        <div className={styles.topBar}>
          <div className={styles.nowPlayingSidebar}>
            <div className={styles.trackInfoPrimary}>
              {/* Track cover */}
              {Spicetify.Player.data.item.images ? 
                Spicetify.Player.data.item.images.length > 0 ? 
                  <img src={Spicetify.Player.data.item.images[0].url} className={styles.trackCover}/> 
                : <></> 
              : <></>}

              {/* Track title */}
              <text className={styles.text} style={{marginTop: "5px", 
                                                    fontSize: "30px",
                                                    fontWeight: "530",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden", 
                                                    whiteSpace: "nowrap",
                                                    textAlign: "center",
                                                    alignContent: "center",
                                                    width: "250px",
                                                    color: "white"}}>
                {Spicetify.Player.data.item.name}
              </text>

              {/* Track artist(s) */}
              {(function () {

                // Get all the artists
                const trackArtists = Spicetify.Player.data.item.artists;
                let trackAritistsInnnerHTML = "";

                // Check if there are any artists
                if (trackArtists) {
                  // Display all the artists
                  for (const artist of trackArtists) {
                    trackAritistsInnnerHTML += (artist.name + ", ")
                  }
                  if(trackAritistsInnnerHTML.length > 0) {
                    trackAritistsInnnerHTML = trackAritistsInnnerHTML.substring(0, trackAritistsInnnerHTML.length - 2);
                  }

                  return <text className={styles.text} style={{fontSize: "15px", 
                                                              marginBottom: "2px",
                                                              textOverflow: "ellipsis",
                                                              width: "250px",
                                                              textAlign: "center",}}> 
                            {trackAritistsInnnerHTML} 
                          </text>
                } else {
                  return <></>;
                }
              })()}

              {/* Track album */}
              <text className={styles.text} style={{fontSize: "15px", 
                                                    textOverflow: "ellipsis", 
                                                    width: "250px",
                                                    textAlign: "center",}}>
                {Spicetify.Player.data.item.album.name}
              </text>
            </div>
          </div>
          <div style={{display: "flex", flexDirection: "row"}}>
            <DynamicRecommendations recTargetProp={this.state.recTarget}></DynamicRecommendations>
          </div>
        </div>
        
        {/* Stats block */}
        <div className={styles.recommendationsLabel} style={{marginLeft: "20px", marginBottom: "0px"}}>
          {"Song Statistics"}
        </div>
        <div className={styles.statsBlock}>
          {/* Statistic #1 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>
                {"Danceability"}
              </div>
              <div className={styles.text} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["danceability"]) * 100)}
              </div>
            </div>
            <div className={styles.graphicContainer}>
              <CircularProgressbar styles={{path: {stroke: "white"}, trail: {stroke: "rgb(80,80,80)"}}} 
                                   value={parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["danceability"])} maxValue={1}>
              </CircularProgressbar>
            </div>
          </div>
          {/* Statistic #2 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>
                {"Energy"}
              </div>
              <div className={styles.text} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["energy"]) * 100)}
              </div>
            </div>
            <div className={styles.graphicContainer}>
              <CircularProgressbar styles={{path: {stroke: "white"}, trail: {stroke: "rgb(80,80,80)"}}} 
                                   value={parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["energy"])} maxValue={1}>
              </CircularProgressbar>
            </div>
          </div>
          {/* Statistic #3 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>
                {"Acousticness"}
              </div>
              <div className={styles.text} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["acousticness"]) * 100)}
              </div>
            </div>
            <div className={styles.graphicContainer}>
              <CircularProgressbar styles={{path: {stroke: "white"}, trail: {stroke: "rgb(80,80,80)"}}} 
                                   value={parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["acousticness"])} maxValue={1}>
              </CircularProgressbar>
            </div>
          </div>
          {/* Statistic #4 */}
          <div className={styles.statContainer}> 
            <div className={styles.statTextContainer}>
              <div className={styles.text} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>
                {"Loudness"}
              </div>
              <div className={styles.text} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["loudness"]))}
                <span className={styles.text} style={{fontSize: "25px", color: "white", fontWeight: "550", marginLeft: "5px"}}>
                  {"dB"}
                </span>
              </div>
            </div>
          </div>
          {/* Statistic #5 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>
                {"Key"}
              </div>
              <div className={styles.text} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {(this.state.audioFeatures as AudioFeaturesResponse)["key"]}
              </div>
            </div>
          </div>
          {/* Statistic #6 */}
          <div className={styles.statContainer}> 
            <div className={styles.statTextContainer}>
              <div className={styles.text} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>
                {"Tempo"}
              </div>
              <div className={styles.text} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["tempo"]))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.recommendationsLabel} style={{marginLeft: "20px",
                                                               marginBottom: "0px",
                                                               marginTop: "10px",
                                                              }}>
              {"Settings"}</div>
          <div className={styles.settingContainer}>
            <span className={styles.settingLabel}>{"Show recommendations by: "}</span>
            <button onClick={this.changeRecTarget} className={styles.recommendationTarget}
                    disabled={false} style={{marginLeft: "10px", marginTop: "0px"}}> 
              {this.state.recTarget} 
          </button>
          </div>
        </div>
      </>
    );
  }
}

export default NowPlaying;
