import styles from "../css/app.module.scss";
import React from "react"; 
import Modal from 'react-modal';
import { GetRecommendationsInput, GetRecommendationsResponse, RecommendationsInput } from "../types/spotify-web-api.d";
import getRecommendations from "../services/dynamicRecommendationsService";
import { SelectedMetrics } from "../types/enhancify";
import getID from './../services/common';

class RecommendationsModal extends React.Component<{modalIsOpen: boolean, setModalIsOpen: (value: boolean) => void, songURI: string, selectedMetrics: SelectedMetrics}, {recommendations: GetRecommendationsResponse | {}}> {

  state = {
    recommendations: {}
  };

  componentDidMount = () => {
    this.generateRecommendations();
  }

  // Generate recommendations by sending a request to the spotify API
  generateRecommendations = async () => {

    // Prepare the recommendations to send to the server
    let apiOptions = new GetRecommendationsInput();
    apiOptions.data.seed_tracks = getID(this.props.songURI);

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
      <Modal className={styles.modal} isOpen={this.props.modalIsOpen} onRequestClose={() => this.props.setModalIsOpen(false)}>
        <button onClick={() => this.props.setModalIsOpen(false)}>close</button>
        {JSON.stringify(this.props.selectedMetrics)}
        {JSON.stringify(this.state.recommendations)}
      </Modal>
    );
  }
}

export default RecommendationsModal;
