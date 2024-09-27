import styles from "../css/app.module.scss";
import React from "react"; 
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class SongMetric extends React.Component<{floatValue: string, 
                                                title: string, 
                                                progressBar: boolean, 
                                                label: string}, 
                                                {}>  {
    
    render() {
        return (
          <div className={styles.statContainer}>
            <div className={styles.statTextContainer}>
              <div className={styles.text} style={{fontSize: "23px", color: "rgb(200,200,200)", fontWeight: "600"}}>
                {this.props.title}
              </div>
              <div className={styles.text} style={{fontSize: "48px", color: "white", fontWeight: "500"}}>
                {Math.round(parseFloat(this.props.floatValue) * (this.props.progressBar ? 100 : 1))}
                { this.props.label != "" ?
                  <span className={styles.text} style={{fontSize: "25px", color: "white", fontWeight: "550", marginLeft: "5px"}}>
                    {this.props.label}
                  </span> : <></> }
              </div>
            </div>
            <div className={styles.graphicContainer}>
              { this.props.progressBar ? 
                <CircularProgressbar styles={{path: {stroke: "white"}, trail: {stroke: "rgb(80,80,80)"}}} 
                                    value={parseFloat(this.props.floatValue)} maxValue={1}>
                </CircularProgressbar> : <></> }
            </div>
          </div>
        );
    }
}

export default SongMetric;