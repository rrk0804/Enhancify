import styles from "../css/app.module.scss";
import React from "react";
import getAudioFeatures from "../services/nowPlayingService";
import { AudioFeaturesResponse } from "../types/spotify-web-api";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import DynamicRecommendations from "./DynamicRecommendations";
import SongMetric from "./SongMetric";

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
          <SongMetric title="Danceability" floatValue={(this.state.audioFeatures as AudioFeaturesResponse)["danceability"]} label="" progressBar={true} />

          {/* Statistic #2 */}
          <SongMetric title="Energy" floatValue={(this.state.audioFeatures as AudioFeaturesResponse)["energy"]} label="" progressBar={true} />

          {/* Statistic #3 */}
          <SongMetric title="Acousticness" floatValue={(this.state.audioFeatures as AudioFeaturesResponse)["acousticness"]} label="" progressBar={true} />

          {/* Statistic #4 */}
          <SongMetric title="Loudness" floatValue={(this.state.audioFeatures as AudioFeaturesResponse)["loudness"]} label="dB" progressBar={false} />

          {/* Statistic #5 */}
          <SongMetric title="Key" floatValue={(this.state.audioFeatures as AudioFeaturesResponse)["key"]} label="" progressBar={false} />

          {/* Statistic #6 */}
          <SongMetric title="Tempo" floatValue={(this.state.audioFeatures as AudioFeaturesResponse)["tempo"]} label="" progressBar={false} />
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
