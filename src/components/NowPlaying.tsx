import styles from "../css/app.module.scss";
import React from "react";
import getAudioFeatures from "../services/nowPlayingService";
import { AudioFeaturesResponse } from "../types/spotify-web-api";
import DynamicRecommendations from "./DynamicRecommendations";
import SongMetric from "./SongMetric";
import { SongMetricData } from "../types/enhancify";
import { allMetrics, getSongMetrics } from "../services/enhancifyInternalService";

class NowPlaying extends React.Component<{}, {audioFeatures: AudioFeaturesResponse | {}, 
                                              songURI: string, 
                                              recTarget: string,
                                              songMetrics: SongMetricData[],
                                              metricsToDisplay: string[]}> {
  
  state = {
    audioFeatures: {},  // Features of the currently playing song (name, artist, stats)
    songURI: "",        // URI of the currently playing song
    recTarget: "songs", // Recommendations based on either songs or artist
    songMetrics: [], // Current song metric information
    metricsToDisplay: ["Danceability", "Energy", "Acousticness", "Loudness", "Key", "Tempo"], // Current metric information types
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
      }, this.setSongMetrics);
    }

    // Make the API call
    apiCall();
  }

  // Sets the song metric information based on the type of information that the user wants to be displayed
  setSongMetrics = () => {
    // this.setState({
    //   metricsToDisplay: ["Danceability", "Energy", "Acousticness", "Loudness", "Key", "Tempo", "Instrumentalness", "Liveness", "Mode", "Speechiness", "Time_Signature", "Valence"] // TODO: Change so that we get the metrics we want to display dynamically
    // }, () => {
    //   this.setState({
    //     songMetrics: getSongMetrics((this.state.audioFeatures as AudioFeaturesResponse), this.state.metricsToDisplay)
    //   });
    // })
    this.setState({
      songMetrics: getSongMetrics((this.state.audioFeatures as AudioFeaturesResponse), this.state.metricsToDisplay)
    });
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
            {Spicetify.Player.data ? 
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
            : <></>}
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

          {/* Stats block data */}
          {this.state.songMetrics.map((songMetric: SongMetricData, i) => {
            return <SongMetric title={songMetric.title} floatValue={songMetric.floatValue} label={songMetric.label} progressBar={songMetric.progressBar} />;
          })}

        </div>
        <div style={{marginTop: String(Math.floor(this.state.songMetrics.length / 3) * 60) + "px"}}>
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
          <div className={styles.settingContainer}>
            <span className={styles.settingLabel}>{"Displayed statistics: "}</span>
            {allMetrics.map((metric: string, i) => {
              return <button className={styles.recommendationTarget} style={{marginLeft: "5px", fontSize: "15px", backgroundColor: this.state.metricsToDisplay.includes(metric) ? "rgb(81, 126, 97)" : "rgb(105,105,105)"}}>{metric}</button>
            })}
            {/* <button onClick={this.changeRecTarget} className={styles.recommendationTarget}
                    disabled={false} style={{marginLeft: "10px", marginTop: "0px"}}> 
              {this.state.recTarget} 
            </button> */}
          </div>
        </div>
      </>
    );
  }
}

export default NowPlaying;
