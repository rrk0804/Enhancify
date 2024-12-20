import styles from "../css/app.module.scss";
import React from "react"; 
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Component for each individual song metric data block
class SongMetric extends React.Component<{floatValue: string, 
                                                title: string, 
                                                progressBar: boolean, 
                                                label: string,
                                                selectMetric: (metric: string, value: string) => void
                                                isMetricSelected: boolean}, 
                                                {}>  {
    
    render() {
        return (
          <div className={styles.statContainer} onClick={() => this.props.selectMetric(this.props.title, this.props.floatValue)} 
               style={this.props.isMetricSelected ? {backgroundColor: "rgb(99, 155, 119",
                                                     border: "2px solid white",
               } : {}}>
            <div className={styles.statTextContainer}>
              <div className={styles.text} style={{fontSize: "23px", 
                                                   color: "rgb(200,200,200)", 
                                                   fontWeight: "600"}}>
                {this.props.title}
              </div>
              <div className={styles.text} style={{fontSize: "48px", 
                                                   color: "white", 
                                                   fontWeight: "500"}}>
                {Math.round(parseFloat(this.props.floatValue) * (this.props.progressBar ? 100 : 1))}

                {/* Label represents the unit (something like dB, bpm, etc.) */}
                { this.props.label != "" ?
                  <span className={styles.text} style={{fontSize: "25px", 
                                                        color: "white", 
                                                        fontWeight: "550", 
                                                        marginLeft: "5px",
                                                        width: "10px",
                                                        height: "10px",
                                                        textOverflow: "ellipsis"}}>
                    {this.props.label}
                  </span> : <></> }
              </div>
            </div>
            { this.props.progressBar ? 
                <div className={styles.graphicContainer}>
                    <CircularProgressbar styles={{path: {stroke: "white"}, trail: {stroke: "rgb(80,80,80)"}}} 
                                        value={parseFloat(this.props.floatValue)} maxValue={1}>
                    </CircularProgressbar> 
                </div>: 
                <></> }
          </div>
        );
    }
}

export default SongMetric;