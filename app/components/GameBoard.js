import { h, render, Component } from 'preact';
import Paddle from './Paddle';
import Ball from './Ball';

const gameBoardStyle = {
  width: '500px',
  height: '500px',
  backgroundColor: 'blue',
  position: 'relative'
};

const initialState = {
  message: 'Pong',
  playerPaddle: {
    posY: 30
  }
};

export default class GameBoard extends Component {
  constructor(props) {
    super(props)
    this.setState(initialState)
    this.logCursorPosition = this.logCursorPosition.bind(this);
  }
  logCursorPosition(e) {
    this.setState({ 
      message: `x: ${e.offsetX}, y: ${e.offsetY}`,
      playerPaddle: {
        posY: e.offsetY
      }
    });
  }
  render({}, { message, playerPaddle }) {
    return (
      <div 
        style={gameBoardStyle}
        onMouseMove={this.logCursorPosition}
      >
        {message}
        <Paddle posY={playerPaddle.posY} />
        <Ball />
      </div>
    )
  }
}