import React from "react";

class Error extends React.Component<{message: string}, {}> {

  render() {
    return (
      <text>{this.props.message}</text>
    )
  }
}

export default Error;