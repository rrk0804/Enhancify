import React from "react";
import NowPlaying from "./components/NowPlaying";
import DynamicRecommendations from "./components/DynamicRecommendations";

class App extends React.Component<{}, {}> {
  render() {
    return (
      <>
        <NowPlaying />
        <DynamicRecommendations />
      </>
    );
  }
}

export default App;
