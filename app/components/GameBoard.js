import { h, render, Component } from 'preact';

const gameBoardStyle = {
  width: '500px',
  height: '500px',
  backgroundColor: 'blue'
};

const initialState = {
  message: 'Pong'
};

export default class GameBoard extends Component {
  constructor(props) {
    super(props)
    this.setState(initialState)
    this.logCursorPosition = this.logCursorPosition.bind(this);
  }
  logCursorPosition(e) {
    this.setState({ message: `x: ${e.offsetX}, y: ${e.offsetY}` });
  }
  render({}, { message }) {
    return (
      <div 
        style={gameBoardStyle}
        onMouseMove={this.logCursorPosition}
      >
        {message}
      </div>
    )
  }
}