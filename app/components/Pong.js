import { h, render, Component } from 'preact';
import Paddle from './Paddle';
import Ball from './Ball';
import GameBoard from './Gameboard';
import Message from './Message';
import { FRAME_RATE } from '../gameConstants';
import MenuMessage from './MenuMessage';

// TODOS
// - update to use game constants more/betterer
// - win condition
// - randomize initial ball y velocity
// - refactor/modularize in general
// - paddle delta
// - paddle edge collisions
// - handle player speed
// - handle mouse reentry
// - collision sounds
// - win/lose sounds

const coord = (x, y) => {
  return {
    x,
    y
  }
};

const coinFlip = () => Math.random() < 0.5;

const invert = (num) => num * -1;

const gameBoardStyle = {
  width: '500px',
  height: '500px',
  backgroundColor: 'blue',
  position: 'relative'
};

const initialState = {
  frame: 0,
  message: 'Pong',
  playing: false,
  player: {
    score: 0,
    position: {
      x: 10,
      y: 250
    }
  },
  computer: {
    score: 0,
    speed: 1.85,
    position: {
      x: 485,
      y: 50
    }
  },
  ball: {
    position: {
      x: 250,
      y: 250
    },
    velocity: {
      x: 0,
      y: 0
    }
  }
};

const between = (min, max) => num => (num >= min) && (num <= max);

export default class Pong extends Component {
  constructor(props) {
    super(props)
    this.setState(initialState)
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    this.setState({
      frame: this.state.frame + 1
    });
    if (this.state.playing) {
      this.updateBall();
      if (this.state.ball.position.x <= -10) {
        this.scorePoint('computer');
        this.resetBall();
      } else if (this.state.ball.position.x >= 500) {
        this.scorePoint('player');
        this.resetBall();
      }
    }
    this.computerFollowBall();
  }
  handleMouseMove(e) {
    this.updateXY('player', 'position', { y: e.offsetY });
  }
  handleClick() {
    if (!this.state.playing) {
      this.setPlaying(true);
      this.launchBall();
    }
  }
  updateXY(entity, prop, coordinates) {
    const { x, y } = coordinates;
    this.setState({
      [entity]: {
        ...this.state[entity],
        [prop]: {
          x: typeof x === 'number' ? x : this.state[entity][prop].x,
          y: typeof y === 'number' ? y : this.state[entity][prop].y
        }
      }
    })
  }
  setPlaying(bool) {
    this.setState({
      playing: bool
    });
  }
  resetBall() {
    this.updateXY('ball', 'position', initialState.ball.position);
    this.updateXY('ball', 'velocity', initialState.ball.velocity);
  }
  launchBall() {
    this.updateXY('ball', 'velocity', {
      x: coinFlip() ? 1 : -1,
      y: -2
    });
  }
  scorePoint(entity) {
    this.setState({
      [entity]: {
        ...this.state[entity],
        score: this.state[entity].score + 1
      }
    });
    this.setPlaying(false);
  }
  updateBall() {
    this.checkBallPaddleCollision('player');
    this.checkBallPaddleCollision('computer');
    this.checkBallWallCollision();
    // move
    const { position, velocity } = this.state.ball;  
    this.setState({
      ball: {
        velocity,
        position: {
          x: position.x + velocity.x,
          y: position.y + velocity.y
        }
      }
    });
  }
  checkBallPaddleCollision(entity) {
    let ballCheckPositionX = this.state.ball.position.x;
    let ballCheckPositionY = this.state.ball.position.y;
    let paddleCheckPositionX = this.state[entity].position.x;
    let paddleCheckPositionYMin = this.state[entity].position.y - 5; // offset for half of ball
    let paddleCheckPositionYMax = paddleCheckPositionYMin + 50 + 5; // offset for offset
    if (entity === 'player') {
      paddleCheckPositionX += 5; // offset for paddle width
    } else if (entity === 'computer') {
      ballCheckPositionX += 10; // offset for ball width
    }
    const ballVelocityX = this.state.ball.velocity.x;
    const inRangeAdjustedForVelocity = between(paddleCheckPositionX - Math.abs(ballVelocityX), paddleCheckPositionX + Math.abs(ballVelocityX));
    if (
      // ballCheckPositionX === paddleCheckPositionX 
      inRangeAdjustedForVelocity(ballCheckPositionX)
      && between(paddleCheckPositionYMin, paddleCheckPositionYMax)(ballCheckPositionY)
    ) {
      // console.log('collision', Math.random());
      const invertedVelocityX = invert(this.state.ball.velocity.x); // REFACTOR
      this.clearBallFromPaddle(entity); // 'player' or 'computer'
      this.updateXY('ball', 'velocity', { x: invertedVelocityX });
      this.speedUpBall();
    }
  }
  clearBallFromPaddle(entity) {
    // const ballVelocityX = this.state.ball.velocity.x;
    // const clearPositionX = entity === 'player' ? 15 + ballVelocityX : 484 - ballVelocityX;
    // this.updateXY('ball', 'position', {
    //   x: clearPositionX
    // });
  }
  checkBallWallCollision() {
    const ballPositionY = this.state.ball.position.y;
    if (ballPositionY <= 0 || ballPositionY >= 490) {
      const invertedVelocityY = this.state.ball.velocity.y * -1; // REFACTOR
      this.updateXY('ball', 'velocity', { y: invertedVelocityY });
    }
  }
  computerFollowBall() {
    const ballPositionY = this.state.ball.position.y;
    const computerPositionY = this.state.computer.position.y;
    const computerPositionYOffset = computerPositionY + 25;
    let paddleMovement = 0;
    if (ballPositionY > computerPositionYOffset + 1) { // 1 offset for glitchiness
      paddleMovement = this.state.computer.speed;
    } else if (ballPositionY < computerPositionYOffset - 1) { // -1 offset for glitchiness
      paddleMovement = invert(this.state.computer.speed);
    }
    this.updateXY('computer', 'position', {
      y: computerPositionY + paddleMovement
    });
  }
  speedUpBall() {
    const ballVelocityX = this.state.ball.velocity.x;
    const isNegative = ballVelocityX < 0;
    const increment = isNegative ? invert(0.5) : 0.5;
    this.updateXY('ball', 'velocity', { x: ballVelocityX + increment });
  }

  render({}, { message, player, computer, ball, playing }) {
    return (
      <GameBoard onMouseMove={this.handleMouseMove} onClick={this.handleClick}>
        { !playing && !computer.score && !player.score &&
          (<MenuMessage>
            <h2>Preact Pong</h2>
            <p>click to start</p>
          </MenuMessage>)
        }
        { player.score >= 10 && 
          (<MenuMessage>
            <h2>YOU WIN</h2>
          </MenuMessage>)
        }
        <Message left>Player: {player.score}</Message>
        <Message right>Computer: {computer.score}</Message>
        <Paddle position={player.position} />
        <Paddle position={computer.position} />
        <Ball position={ball.position} />
      </GameBoard>
    )
  }
}