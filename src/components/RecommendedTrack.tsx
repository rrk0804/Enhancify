import styles from "../css/app.module.scss";
import React from "react"; 

class RecommendedTrack extends React.Component<{songCover: string, 
                                                songName: string, 
                                                songArtists: string[], 
                                                songAlbum: string}, 
                                                {paddingRight: string}>  {

    playIcon = <img className={styles.playIcon} src={"https://img.icons8.com/?size=100&id=36067&format=png&color=FFFFFF"}/>;
    
    render() {
        return (
            <div className={styles.trackContainer}>
              <img className={styles.recommendationsCover} src={this.props.songCover}/>
              <div className={styles.trackDetils}>
                <div className={styles.trackName}>
                    {this.props.songName.length > 12 ? 
                        <p className={styles.trackNameText + " " + styles.scrollTitle}>
                            {this.props.songName}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {this.props.songName}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>:
                        <p className={styles.trackNameText}> {this.props.songName}</p> 
                    }
                </div>
                <div>
                    {Object.keys(this.props.songArtists).length > 0 ? ( () => {
                        // Get all the artists
                        const trackArtists = this.props.songArtists;
                        let trackAritistsInnnerHTML = "";

                        // Check if there are any artists
                        if (trackArtists) {
                        // Display all the artists
                        for (const artist of trackArtists) {
                            trackAritistsInnnerHTML += (artist + ", ")
                        }
                        if(trackAritistsInnnerHTML.length > 0) {
                            trackAritistsInnnerHTML = trackAritistsInnnerHTML.substring(0, trackAritistsInnnerHTML.length - 2);
                        }

                        return (<div className={styles.text} style={{width: "150px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}> 
                                    {trackAritistsInnnerHTML} 
                                </div>);
                        } else {
                        return <></>;
                        }

                        })() : <div></div>}
                </div>
                <div style={{width: "150px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
                    {this.props.songAlbum}
                </div>
              </div>
              {/* Play icon*/}
              {this.playIcon}
            </div>
        );
    }
}

export default RecommendedTrack;