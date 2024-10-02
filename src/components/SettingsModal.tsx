import styles from "../css/app.module.scss";
import React from "react"; 
import { allMetrics, getSongMetrics } from "../services/enhancifyInternalService";

class SettingsModal extends React.Component<{changeRecTarget: () => void,
                                             toggleMetric: (metric: string) => void, 
                                             recTarget: string, 
                                             metricsToDisplay: string[]} , {}> {

    render() {
        return (
        <div className={styles.settingsModalContainer}>
            <div className={styles.recommendationsLabel} style={{marginLeft:  "20px",
                                                                marginBottom: "0px",
                                                                marginTop:    "10px",
                                                                }}>
                {"Settings"}
            </div>
            <div className={styles.settingContainer}>
                <span className={styles.settingLabel}>{"Show recommendations by: "}</span>
                <button onClick={this.props.changeRecTarget} className={styles.recommendationTarget}
                        disabled={false} style={{marginLeft: "10px", marginTop: "0px"}}> 
                    {this.props.recTarget} 
                </button>
            </div>
            <div className={styles.settingContainer}>
                <span className={styles.settingLabel}>{"Displayed statistics: "}</span>
                {allMetrics.map((metric: string, i) => {
                    return (<button className={styles.recommendationTarget} 
                                    style={{marginLeft:      "5px", 
                                            fontSize:        "15px", 
                                            backgroundColor: this.props.metricsToDisplay.includes(metric) ? 
                                                            "rgb(81, 126, 97)" : "rgb(105,105,105)"}} 
                                onClick={() => this.props.toggleMetric(metric)}>
                                {metric}
                        </button>);
                })}
            </div>
      </div>);
    }
}

export default SettingsModal;