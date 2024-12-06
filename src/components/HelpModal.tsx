import styles from "../css/app.module.scss";
import React from "react"; 
import { allMetrics } from "../services/enhancifyInternalService";

class HelpModal extends React.Component<{setModalIsOpen: (value: boolean) => void} , {}> {

    render() {
        return (
        <div className={styles.settingsModalContainer}>
            <div className={styles.modalHeaderContainer}>
                <div className={styles.recommendationsLabel} style={{marginLeft:  "20px",
                                                                    marginBottom: "0px",
                                                                    marginTop:    "10px",
                                                                    }}>
                    {"Help"}
                </div>
                <img className={styles.playIcon} style={{marginLeft: "auto"}} 
                     src={"https://img.icons8.com/?size=100&id=6483&format=png&color=FFFFFF"} 
                      onClick={() => this.props.setModalIsOpen(false)}/>
            </div>
            <div className={styles.settingContainer}>
                <span className={styles.settingLabel} style={{fontSize: "x-large", paddingBottom: "10px"}}>Visit the link below for documentation on Enhancify:</span>
                <a href="https://github.com/ECE49595-Team-6/EnhancifyInstall/wiki" className={styles.settingLabel} style={{fontSize: "large", fontWeight: "bolder"}}>Enhancify Wiki Link</a>
            </div>
            <div className={styles.settingContainer} style={{position: "absolute", bottom: "0", paddingLeft: "0", marginLeft: "-13px", marginBottom: "5px"}}>
                <span className={styles.settingLabel} style={{fontSize: "medium"}}>{"Enhancify Version 1.0.0"}</span>
            </div> 
      </div>);
    }
}

export default HelpModal;