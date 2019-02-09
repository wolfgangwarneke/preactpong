import { h, render, Component } from 'preact';

const paddleStyle = {
  width: '5px',
  height: '50px',
  backgroundColor: 'white',
  position: 'absolute'
};

const initialState = {
  top: 40, // not being used...
  left: 10
};

export default class Paddle extends Component {
  constructor(props) {
    super(props)
    this.setState(initialState)
  }
  logCursorPosition(e) {
    this.setState({ message: `x: ${e.offsetX}, y: ${e.offsetY}` });
  }
  render({posY}, { left }) {
    return (
      <div style={{...paddleStyle, left ,top: posY }}></div>
    )
  }
}