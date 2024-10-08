import React from "react"; 
import { GetRecommendationsInput, GetRecommendationsResponse, RecommendationsInput } from "../types/spotify-web-api.d";
import getRecommendations from "../services/dynamicRecommendationsService";
import { SelectedMetrics } from "../types/enhancify";
import getID from './../services/common';
import { RecommendationsRender } from "../services/enhancifyInternalService";

class RecommendationsModal extends React.Component<{setModalIsOpen: (value: boolean) => void, songURI: string, selectedMetrics: SelectedMetrics}, {recommendations: GetRecommendationsResponse | {}}> {

  state = {
    recommendations: {} // Recommendations that show up in the modal view
  };

  componentDidMount = () => {
    this.generateRecommendations();
  }

  // Generate recommendations by sending a request to the spotify API
  generateRecommendations = async () => {

    // Prepare the recommendations to send to the server
    let apiOptions = new GetRecommendationsInput();
    apiOptions.data.seed_tracks = getID(this.props.songURI);
    apiOptions.data.limit = "10";

    for (let key in this.props.selectedMetrics) {
      let apiDataKey = "target_" + key.toLowerCase();
      apiOptions.data[apiDataKey as keyof RecommendationsInput] = this.props.selectedMetrics[key];
    }
    
    // Make the API call
    var recommendations = await getRecommendations(apiOptions);
    this.setState({
      recommendations: recommendations,
    });
  };

  render() {
    return (
      <>
        <button onClick={() => this.props.setModalIsOpen(false)}>close</button>
        {RecommendationsRender(this.state.recommendations)}
      </>
    );
  }
}

export default RecommendationsModal;
