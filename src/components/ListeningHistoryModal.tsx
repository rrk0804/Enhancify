import styles from "../css/app.module.scss";
import React from "react";
import type { HistoricalMetrics } from "../types/enhancify";
import getRecentlyPlayedTracksMetrics from "./../services/recentlyPlayedService"
import SongMetric from "./SongMetric";

class ListeningHistoryModal extends React.Component <{setModalIsOpen: (value: boolean) => void}, {metricsValues: HistoricalMetrics | {}}> {
    state = {
        metricsValues: {
            acousticness: {
                average: 0,
                count: 0
            },
            danceability: {
                average: 0,
                count: 0
            },
            energy: {
                average: 0,
                count: 0
            },
            instrumentalness: {
                average: 0,
                count: 0
            },
            liveness: {
                average: 0,
                count: 0
            },
            speechiness: {
                average: 0,
                count: 0
            },
            valence: {
                average: 0,
                count: 0
            },
        }
    }

    async componentDidMount(): Promise<void> {
        let newState = await getRecentlyPlayedTracksMetrics();
        this.setState({
            metricsValues: newState,
        });
    }

    render() {
        return (
            <div className={styles.settingsModalContainer} style={{paddingBottom: "20px", paddingLeft: "40px"}}>
                <div className={styles.modalHeaderContainer}>
                    <div className={styles.recommendationsLabel} style={{marginLeft:  "20px",
                                                                        marginBottom: "0px",
                                                                        marginTop:    "10px",
                                                                        }}>
                        {"Listening History"}
                    </div>
                    <img className={styles.playIcon} style={{marginLeft: "auto"}} 
                        src={"https://img.icons8.com/?size=100&id=6483&format=png&color=FFFFFF"} 
                        onClick={() => this.props.setModalIsOpen(false)}/>
                </div>
                <div className={styles.statsBlock} style={{marginBottom: "40px"}}>
                    {Object.keys(this.state.metricsValues).map((metric: string) => {
                        if (this.state.metricsValues[metric as keyof HistoricalMetrics].count) {
                            return <SongMetric title={metric}
                                            floatValue={this.state.metricsValues[metric as keyof HistoricalMetrics].average.toString()}
                                            label={""}
                                            progressBar={true}
                                            selectMetric={(metric: string, value: string) => {}}
                                    ></SongMetric>;
                        } else {
                        return <></>;
                        }
                    })}
                </div>
            </div>);
    }
}

export default ListeningHistoryModal;