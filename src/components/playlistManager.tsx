import styles from "../css/app.module.scss";
import React from "react";
import getMultiTrackAudioFeatures from "../services/multiTrackAudioFeaturesService";
import getPlaylistTrackIDs from "../services/playlistTrackIDService";
import { AudioFeaturesResponse } from "../types/spotify-web-api";

class PlaylistManager extends React.Component<{}, {audioFeatures: AudioFeaturesResponse[], songIDs: string[]}> {
    state = {
        audioFeatures: [],
        songIDs: [],
    }
  
    componentDidMount = () => {
        // Add listener for playlist change
        Spicetify.Player.addEventListener("songchange", this.handlePlaylistChange);
    }
  
    componentWillUnmount = () => {
        // Remove the event listener when the component is unmounted
        Spicetify.Player.removeEventListener("songchange", this.handlePlaylistChange);
    }
  
    handlePlaylistChange = async () => {
        const playlistID = this.getCurrentPlaylistID();
        if (!playlistID) return;
    
        const cachedSongIDs = this.getCachedData(playlistID, "songIDs");
        const cachedAudioFeatures = this.getCachedData(playlistID, "audioFeatures");
    
        // If song IDs or audio features are cached, use the cached data
        if (cachedSongIDs && cachedAudioFeatures) {
            this.setState({
            songIDs: cachedSongIDs,
            audioFeatures: cachedAudioFeatures,
            });
            return;
        }
    
        // Fetch song IDs if not cached
        let songIDs = cachedSongIDs || await getPlaylistTrackIDs(playlistID);
        this.cacheData(playlistID, "songIDs", songIDs);
    
        // Fetch audio features if not cached
        let audioFeatures = cachedAudioFeatures || await getMultiTrackAudioFeatures(songIDs);
        this.cacheData(playlistID, "audioFeatures", audioFeatures);
    
        this.setState({
            songIDs,
            audioFeatures,
        });
    }
  
    // Helper function to get current playlist ID
    getCurrentPlaylistID = (): string | null => {
        if (!Spicetify.Player.data || !Spicetify.Player.data.context.uri) {
          return null;
        }
      
        const contextURI = Spicetify.Player.data.context.uri;
      
        // Check if the URI is a playlist URI
        if (contextURI && contextURI.startsWith("spotify:playlist:")) {
            return contextURI.split(":")[2];  // Extract playlistID
        }
    
        return null;
    }
  
    // Helper function to get cached data
    getCachedData = (playlistID: string, dataType: string) => {
        const cacheKey = `${playlistID}_${dataType}.json`;
        const cachedData = localStorage.getItem(cacheKey);
        return cachedData ? JSON.parse(cachedData) : null;
    }
  
    // Helper function to cache data
    cacheData = (playlistID: string, dataType: string, data: any) => {
        const cacheKey = `${playlistID}_${dataType}.json`;
        localStorage.setItem(cacheKey, JSON.stringify(data));
    }
  
    render() {
        return (
            <>
            <div className={styles.text}>
                <h2>Song IDs</h2>
                <p>{JSON.stringify(this.state.songIDs)}</p>
    
                <h2>Audio Features</h2>
                <p>{JSON.stringify(this.state.audioFeatures)}</p>
            </div>
            </>
        );
    }
}
  
export default PlaylistManager;