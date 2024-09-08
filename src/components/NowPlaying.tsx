import styles from "../css/app.module.scss";
import React from "react";
import getAudioFeatures from "../services/nowPlayingService";
import { AudioFeaturesResponse } from "../types/spotify-web-api";

// All components are now classes
// Extends means that the class is inheriting all the properties of a React component
// The component does not accept any props because it does not take anything in. The second 
// object describes the state of the component, which contains audioFeatures and songURI. Each 
// state variable must be typed.
class NowPlaying extends React.Component<{}, {audioFeatures: AudioFeaturesResponse | {}, songURI: string}> {
  
  // The component has two states: one for holding the features 
  // of the audio and another for holding the song's URI
  state = {
    audioFeatures: {},
    songURI: "",
    songPlayerInfo: {},
  }

  // After the component is mounted to the screen, make API 
  // calls to get the features of the currenly playing song
  componentDidMount = () => {
    this.setAudioFeatures();
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
  
  playIcon = <img className={styles.playIcon} src={"https://img.icons8.com/?size=100&id=36067&format=png&color=FFFFFF"}/>;

  nowPlayingStyles = {
    primaryTrackInfo: {}
  }
  render() {
    // Add an event listener for when the song is changed
    Spicetify.Player.addEventListener("songchange", this.setAudioFeatures);
    return (
      <>
        {/* <text className={styles.text}>
          {JSON.stringify(this.state.audioFeatures)}
        </text> */}
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
              <img className={styles.recommendationsCover} src={"https://upload.wikimedia.org/wikipedia/en/d/dd/Ray_of_Light_Madonna.png"}/>
              {/* Recommendation track details */}
              <div className={styles.trackDetils}>
                <div className={styles.trackName}>{"Ray of light"}</div>
                <div>{"Madonna"}</div>
                <div>{"Ray of light"}</div>
              </div>
              {/* Play icon */}
              {this.playIcon}
            </div>
            {/* Recommendation #2 */}
            <div className={styles.trackContainer}>
              {/* Recommendation cover */}
              <img className={styles.recommendationsCover} src={"https://upload.wikimedia.org/wikipedia/en/d/dd/Lady_Gaga_–_The_Fame_album_cover.png"}/>
              {/* Recommendation track details */}
              <div className={styles.trackDetils}>
                <div className={styles.trackName}>{"Poker Face"}</div>
                <div>{"Lady Gaga"}</div>
                <div>{"The Fame"}</div>
              </div>
              {/* Play icon*/}
              {this.playIcon}
            </div>
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={"https://d3hbw55pes5y9s.cloudfront.net/wp-content/uploads/2009/09/23084712/tumblr_inline_odrvhgDB3x1rpr2it_1280-1.jpg"}/>
              <div className={styles.trackDetils}>
                <div className={styles.trackName}>{"Like a Prayer"}</div>
                <div>{"Madonna"}</div>
                <div>{"Like a Prayer"}</div>
              </div>
              {this.playIcon}
            </div>
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={"https://i.iheart.com/v3/re/new_assets/63502b9eaee0f4b0e56f9a54?ops=contain(1480,0)"}/>
              <div className={styles.trackDetils}>
                <div className={styles.trackName}>{"Anti Hero"}</div>
                <div>{"Taylor Swift"}</div>
                <div>{"Midnights"}</div>
              </div>
              {this.playIcon}
            </div>
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={"https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647"}/>
              <div className={styles.trackDetils}>
                <div className={styles.trackName}>{"Lover"}</div>
                <div>{"Taylor Swift"}</div>
                <div>{"Lover"}</div>
              </div>
              {this.playIcon}
            </div>
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={"https://amateurphotographer.com/wp-content/uploads/sites/7/2024/03/The-original-2014-cover-of-the-Taylor-Swift-album-1989.jpg?w=1024"}/>
              <div className={styles.trackDetils}>
                <div className={styles.trackName}>{"Shake It Off"}</div>
                <div>{"Taylor Swift"}</div>
                <div>{"1989"}</div>
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
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(180,180,180)", fontWeight: "600"}}>{"Danceability"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>{"75"}</div>
            </div>
            <div className={styles.graphicContainer}>
              {/* <div style={{width: "70px", height: "70px", borderRadius: "35px", backgroundColor: "white"}}></div> */}
            </div>
          </div>
          {/* Statistic #2 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(180,180,180)", fontWeight: "600"}}>{"Energy"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>{"55"}</div>
            </div>
            <div className={styles.graphicContainer}>
              {/* <div style={{width: "70px", height: "70px", borderRadius: "35px", backgroundColor: "white"}}></div> */}
            </div>
          </div>
          {/* Statistic #3 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(180,180,180)", fontWeight: "600"}}>{"Acousticness"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>{"65"}</div>
            </div>
            <div className={styles.graphicContainer}>
              {/* <div style={{width: "70px", height: "70px", borderRadius: "35px", backgroundColor: "white"}}></div> */}
            </div>
          </div>
          {/* Statistic #4 */}
          <div className={styles.statContainer}> 
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(180,180,180)", fontWeight: "600"}}>{"Loudness"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>{"85"}</div>
            </div>
            <div className={styles.graphicContainer}>
              {/* <div style={{width: "70px", height: "70px", borderRadius: "35px", backgroundColor: "white"}}></div> */}
            </div>
          </div>
          {/* Statistic #5 */}
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(180,180,180)", fontWeight: "600"}}>{"Key"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>{"95"}</div>
            </div>
            <div className={styles.graphicContainer}>
              {/* <div style={{width: "70px", height: "70px", borderRadius: "35px", backgroundColor: "white"}}></div> */}
            </div>
          </div>
          {/* Statistic #6 */}
          <div className={styles.statContainer}> 
            <div className={styles.statTextContainer}>
              <div className={styles.text + styles.statLabel} style={{fontSize: "23px", color: "rgb(180,180,180)", fontWeight: "600"}}>{"Tempo"}</div>
              <div className={styles.text + styles.statValue} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>{"65"}</div>
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
