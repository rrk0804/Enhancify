import styles from "./css/app.module.scss";
import React from "react";

let accessToken = Spicetify.Platform.Session.accessToken;

class App extends React.Component<{}, { count: number; info: string }> {
  state = {
    count: 0,
    info: "",
  };

  stopConfettiTimeout: NodeJS.Timeout | null = null;

  onButtonClick = () => {
    this.setState((state) => {
      return {
        count: state.count + 1,
      };
    });
    const resFunc = async () => {
      let response = await fetch(
        "https://api.spotify.com/v1/recommendations?seed_genres=classical",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      let res = await response.json();
      this.setState({
        info: res["tracks"][0]["name"],
      });
    };
    resFunc();
  };

  render() {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.title}>{"My Custom App!"}</div>
          <button className={styles.button} onClick={this.onButtonClick}>
            {this.state.info}
          </button>
          <div className={styles.counter}>{this.state.count}</div>
        </div>
      </>
    );
  }
}

export default App;
