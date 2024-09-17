import styles from "../css/app.module.scss";
import React from "react";
import getAudioFeatures from "../services/nowPlayingService";
import { AudioFeaturesResponse } from "../types/spotify-web-api";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import getRecommendations from "../services/dynamicRecommendationsService";
import { GetRecommendationsInput, GetRecommendationsResponse } from "../types/spotify-web-api.d";


class NowPlaying extends React.Component<{}, {audioFeatures: AudioFeaturesResponse | {}, 
                                              songURI: string, 
                                              queue: Array<string>, 
                                              recommendations: GetRecommendationsResponse | {}}> {
  
  state = {
    audioFeatures: {},
    songURI: "",
    songPlayerInfo: {},
    queue: Spicetify.LocalStorage.get("queue")?.split(',') || new Array<string>,
    recommendations: {},
  }

  componentDidMount = () => {
    this.setAudioFeatures();
    this.generateRecommendations();
  }
  
  setAudioFeatures = () => {
    if (!Spicetify.Player.data || this.state.songURI == Spicetify.Player.data.item.uri) {

      return;
    }
    this.state.songURI = Spicetify.Player.data.item.uri;

    const apiCall = async () => {
      const currentAudioFeatures = await getAudioFeatures(this.state.songURI || "");
      this.setState({
        audioFeatures: currentAudioFeatures,
      });
    }

    apiCall();
  }
  
  generateRecommendations = async () => {
    let apiOptions = new GetRecommendationsInput();
    apiOptions.data.seed_tracks = this.state.queue.toString();
    var recommendations = await getRecommendations(apiOptions);
    this.setState({
      recommendations: recommendations,
    });
  };

  addToQueue = (event?: Event & {data: number}) => {
    if (!event || !Spicetify.Player.data || this.state.queue.includes(Spicetify.Player.data.item.uri.split(":")[2])) {
      return;
    }

    let progressPercentage = (event.data / Spicetify.Player.data.item.duration.milliseconds) * 100;
    if (progressPercentage < 50) {
      return;
    }

    let newQueue = this.state.queue.slice();
    if (this.state.queue.length == 5) {
      newQueue.shift();
    }

    newQueue.push(Spicetify.Player.data.item.uri.split(":")[2]);
    this.setState({
      queue: newQueue,
    }, () => {
      if (Spicetify.LocalStorage.get("queue") == this.state.queue.toString()) {
        return;
      }
      Spicetify.LocalStorage.set("queue", this.state.queue.toString());
      this.generateRecommendations();
    });
  }
  
  playIcon = <img className={styles.playIcon} src={"https://img.icons8.com/?size=100&id=36067&format=png&color=FFFFFF"}/>;
  recommendationIndexes = Array.from(Array(6).keys());
  recommendationItem = (i : number) =>
                        (<div className={styles.trackContainer}>
                          {/* Recommendation cover */}
                          <img className={styles.recommendationsCover} src={Object.keys(this.state.recommendations).length > 0 ? 
                                                                              (this.state.recommendations as GetRecommendationsResponse)["tracks"][i].album.images[0].url : 
                                                                            ""}/>
                          {/* Recommendation track details */}
                          <div className={styles.trackDetils}>
                            <div className={styles.trackName}>
                              {Object.keys(this.state.recommendations).length > 0 ? 
                                (this.state.recommendations as GetRecommendationsResponse)["tracks"][i].name : 
                              ""}
                            </div>
                              {Object.keys(this.state.recommendations).length > 0 ? ( () => {
                                // Get all the artists
                                const trackArtists = (this.state.recommendations as GetRecommendationsResponse)["tracks"][i].artists;
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

                                  return (<div className={styles.text}> 
                                            {trackAritistsInnnerHTML} 
                                          </div>);
                                } else {
                                  return <></>;
                                }

                                })() : <div></div>}
                            <div>
                            {Object.keys(this.state.recommendations).length > 0 ? 
                                (this.state.recommendations as GetRecommendationsResponse)["tracks"][i].album.name : 
                            ""}
                            </div>
                          </div>
                          {/* Play icon */}
                          {this.playIcon}
                        </div>);
    recommendationItems = this.recommendationIndexes.map((i) => this.recommendationItem(i));

  render() {
    Spicetify.Player.addEventListener("songchange", this.setAudioFeatures);
    Spicetify.Player.addEventListener("onprogress", this.addToQueue);
    return (
      <>
        <div className={styles.topBar}>
          {/* Now playing rectangle sidebar */}
          <div className={styles.nowPlayingSidebar}>
            {/* Primary track info */}
            <div className={styles.trackInfoPrimary}>
              {/* Track cover */}
              {/* Check if there is an image associated with the track */}
              {Spicetify.Player.data.item.images ? 
                Spicetify.Player.data.item.images.length > 0 ? 
                  <img src={Spicetify.Player.data.item.images[0].url} className={styles.trackCover}/> 
                : <></> 
              : <></>}

              {/* Track title */}
              <text className={styles.text} style={{marginTop: "5px", 
                                                    fontSize: "30px",
                                                    fontWeight: "530"}}>
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
                                                              marginBottom: "2px"}}> 
                                                              {trackAritistsInnnerHTML} 
                          </text>
                } else {
                  return <></>;
                }

              })()}

              {/* Track album */}
              <text className={styles.text} style={{fontSize: "15px"}}>
                {Spicetify.Player.data.item.album.name}
              </text>
            </div>
          </div>
          {/* Recommendations block */}
          <div className={styles.recommendationsBlock}>
            {/* Recommendation #1 */}
            <div className={styles.trackContainer}>
              {/* Recommendation cover */}
              <img className={styles.recommendationsCover} src={Object.keys(this.state.recommendations).length > 0 ? 
                                                                  (this.state.recommendations as GetRecommendationsResponse)["tracks"][0].album.images[0].url : 
                                                                ""}/>
              {/* Recommendation track details */}
              <div className={styles.trackDetils}>
                <div className={styles.trackName}>
                  {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][0].name : 
                   ""}
                </div>
                  {Object.keys(this.state.recommendations).length > 0 ? ( () => {
                    // Get all the artists
                    const trackArtists = (this.state.recommendations as GetRecommendationsResponse)["tracks"][0].artists;
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

                      return (<div className={styles.text}> 
                                {trackAritistsInnnerHTML} 
                              </div>);
                    } else {
                      return <></>;
                    }

                    })() : <div></div>}
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][0].album.name : 
                 ""}
                </div>
              </div>
              {/* Play icon */}
              {this.playIcon}
            </div>
            {/* Recommendation #2 */}
            <div className={styles.trackContainer}>
              {/* Recommendation cover */}
              <img className={styles.recommendationsCover} src={Object.keys(this.state.recommendations).length > 0 ? 
                                                                  (this.state.recommendations as GetRecommendationsResponse)["tracks"][1].album.images[0].url : 
                                                                ""}/>
              {/* Recommendation track details */}
              <div className={styles.trackDetils}>
              <div className={styles.trackName}>
                  {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][1].name : 
                   ""}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? ( () => {
                    // Get all the artists
                    const trackArtists = (this.state.recommendations as GetRecommendationsResponse)["tracks"][1].artists;
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

                      return (<div className={styles.text}> 
                                {trackAritistsInnnerHTML} 
                              </div>);
                    } else {
                      return <></>;
                    }

                    })() : <div></div>}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][1].album.name : 
                 ""}
                </div>
              </div>
              {/* Play icon*/}
              {this.playIcon}
            </div>
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={Object.keys(this.state.recommendations).length > 0 ? 
                                                                  (this.state.recommendations as GetRecommendationsResponse)["tracks"][2].album.images[0].url : 
                                                                ""}/>
              <div className={styles.trackDetils}>
              <div className={styles.trackName}>
                  {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][2].name : 
                   ""}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? ( () => {
                    // Get all the artists
                    const trackArtists = (this.state.recommendations as GetRecommendationsResponse)["tracks"][2].artists;
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

                      return (<div className={styles.text}> 
                                {trackAritistsInnnerHTML} 
                              </div>);
                    } else {
                      return <></>;
                    }

                    })() : <div></div>}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][2].album.name : 
                 ""}
                </div>
              </div>
              {this.playIcon}
            </div>
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={Object.keys(this.state.recommendations).length > 0 ? 
                                                                  (this.state.recommendations as GetRecommendationsResponse)["tracks"][3].album.images[0].url : 
                                                                ""}/>
              <div className={styles.trackDetils}>
              <div className={styles.trackName}>
                  {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][3].name : 
                   ""}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? ( () => {
                    // Get all the artists
                    const trackArtists = (this.state.recommendations as GetRecommendationsResponse)["tracks"][3].artists;
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

                      return (<div className={styles.text}> 
                                {trackAritistsInnnerHTML} 
                              </div>);
                    } else {
                      return <></>;
                    }

                    })() : <div></div>}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][3].album.name : 
                 ""}
                </div>
              </div>
              {this.playIcon}
            </div>
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={Object.keys(this.state.recommendations).length > 0 ? 
                                                                  (this.state.recommendations as GetRecommendationsResponse)["tracks"][4].album.images[0].url : 
                                                                ""}/>
              <div className={styles.trackDetils}>
              <div className={styles.trackName}>
                  {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][4].name : 
                   ""}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? ( () => {
                    // Get all the artists
                    const trackArtists = (this.state.recommendations as GetRecommendationsResponse)["tracks"][4].artists;
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

                      return (<div className={styles.text}> 
                                {trackAritistsInnnerHTML} 
                              </div>);
                    } else {
                      return <></>;
                    }

                    })() : <div></div>}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][4].album.name : 
                 ""}
                </div>
              </div>
              {this.playIcon}
            </div>
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={Object.keys(this.state.recommendations).length > 0 ? 
                                                                  (this.state.recommendations as GetRecommendationsResponse)["tracks"][5].album.images[0].url : 
                                                                ""}/>
              <div className={styles.trackDetils}>
              <div className={styles.trackName}>
                  {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][5].name : 
                   ""}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? ( () => {
                    // Get all the artists
                    const trackArtists = (this.state.recommendations as GetRecommendationsResponse)["tracks"][5].artists;
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

                      return (<div className={styles.text}> 
                                {trackAritistsInnnerHTML} 
                              </div>);
                    } else {
                      return <></>;
                    }

                    })() : <div></div>}
                </div>
                <div>
                {Object.keys(this.state.recommendations).length > 0 ? 
                    (this.state.recommendations as GetRecommendationsResponse)["tracks"][5].album.name : 
                 ""}
                </div>
              </div>
              {this.playIcon}
            </div>
          </div>
        </div>
        
        {/* Stats block */}
        <div className={styles.statsBlock}>
          {/* Statistic #1 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>{"Danceability"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["danceability"]) * 100)}
              </div>
            </div>
            <div className={styles.graphicContainer}>
              <CircularProgressbar styles={{path: {stroke: "white"}, trail: {stroke: "rgb(80,80,80)"}}} value={parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["danceability"])} maxValue={1}></CircularProgressbar>
            </div>
          </div>
          {/* Statistic #2 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>{"Energy"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["energy"]) * 100)}
              </div>
            </div>
            <div className={styles.graphicContainer}>
            <CircularProgressbar styles={{path: {stroke: "white"}, trail: {stroke: "rgb(80,80,80)"}}} value={parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["energy"])} maxValue={1}></CircularProgressbar>
            </div>
          </div>
          {/* Statistic #3 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>{"Acousticness"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["acousticness"]) * 100)}
              </div>
            </div>
            <div className={styles.graphicContainer}>
            <CircularProgressbar styles={{path: {stroke: "white"}, trail: {stroke: "rgb(80,80,80)"}}} value={parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["acousticness"])} maxValue={1}></CircularProgressbar>
            </div>
          </div>
          {/* Statistic #4 */}
          <div className={styles.statContainer}> 
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>{"Loudness"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["loudness"]))}
                <span className={styles.text} style={{fontSize: "25px", color: "white", fontWeight: "550", marginLeft: "5px"}}>
                  {"dB"}
                </span>
                </div>
            </div>
            <div className={styles.graphicContainer}>
              {/* <div style={{width: "70px", height: "70px", borderRadius: "35px", backgroundColor: "white"}}></div> */}
            </div>
          </div>
          {/* Statistic #5 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>{"Key"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>{(this.state.audioFeatures as AudioFeaturesResponse)["key"]}</div>
            </div>
            <div className={styles.graphicContainer}>
              {/* <div style={{width: "70px", height: "70px", borderRadius: "35px", backgroundColor: "white"}}></div> */}
            </div>
          </div>
          {/* Statistic #6 */}
          <div className={styles.statContainer}> 
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>{"Tempo"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
              {Math.round(parseFloat((this.state.audioFeatures as AudioFeaturesResponse)["tempo"]))}
                </div>
            </div>
            <div className={styles.graphicContainer}>
              {/* <div style={{width: "70px", height: "70px", borderRadius: "35px", backgroundColor: "white"}}></div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default NowPlaying;
