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

const between = (min, max) => num => (num >= min) && (num <= max);

export default class GameBoard extends Component {
  constructor(props) {
    super(props)
    this.setState(initialState)
    this.logCursorPosition = this.logCursorPosition.bind(this);
    this.reportBallPosition = this.reportBallPosition.bind(this);
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
  reportBallPosition(position, whenCollision) {
    //console.log(position);
    if (position.left === 10)
      this.checkCollision(position, this.state.playerPaddle.posY, whenCollision);
  }
  checkCollision(ballPos, paddleY, whenCollision) {
    if (between(paddleY, paddleY + 50)(ballPos.top)) {
      console.warn('BALL COLIISOASDIAPADDIELE');
      whenCollision();
    }
  }
  render({}, { message, playerPaddle, frame }) {
    return (
      <div 
        style={gameBoardStyle}
        onMouseMove={this.logCursorPosition}
      >
        {message}
        <Paddle posY={playerPaddle.posY} />
        <Ball 
          reportPosition={this.checkCollision} 
          frame={frame}
          reportPosition={this.reportBallPosition}
        />
      </div>
    )
  }
}