import { h, render, Component } from 'preact';
import Paddle from './Paddle';
import Ball from './Ball';
import { FRAME_RATE } from '../gameConstants';

const gameBoardStyle = {
  width: '500px',
  height: '500px',
  backgroundColor: 'blue',
  position: 'relative'
};

const initialState = {
  frame: 0,
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
  componentDidMount() {
    this.frameTimerID = setInterval(
      () => this.tick(),
      FRAME_RATE
    );
  }
  componentWillUnmount() {
    clearInterval(this.frameTimerID);
  }
  tick() {
    //console.warn('TICKTOCK');
    this.setState({
      frame: this.state.frame + 1
    });
  }
  logCursorPosition(e) {
    this.setState({ 
      message: `x: ${e.offsetX}, y: ${e.offsetY}`,
      playerPaddle: {
        posY: e.offsetY
      }
    });
  }
  render({}, { message, playerPaddle, frame }) {
    return (
      <div 
        style={gameBoardStyle}
        onMouseMove={this.logCursorPosition}
      >
        {message}
        <Paddle posY={playerPaddle.posY} />
        <Ball frame={frame} />
      </div>
    )
  }
}