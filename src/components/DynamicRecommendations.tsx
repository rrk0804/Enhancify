import styles from "../css/app.module.scss";
import React from "react";
import getRecommendations from "../services/dynamicRecommendationsService";
import { GetRecommendationsInput, GetRecommendationsResponse } from "../types/spotify-web-api.d";

class DynamicRecommendations extends React.Component<{}, {queue: Array<string>, recommendations: GetRecommendationsResponse | {}}> {
  state = {
    queue: Spicetify.LocalStorage.get("queue")?.split(',') || new Array<string>,
    recommendations: {},
  }

  componentDidMount = () => {
    this.generateRecommendations();
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

  render() {
    Spicetify.Player.addEventListener("onprogress", this.addToQueue);
    return (
      <>
        <text className={styles.text}>
          {String(this.state.queue)}
          {JSON.stringify(Object.keys(this.state.recommendations).length != 0 ? (this.state.recommendations as GetRecommendationsResponse)["tracks"][0].name : {})}
        </text>
      </>
    );
  }
}

export default DynamicRecommendations
