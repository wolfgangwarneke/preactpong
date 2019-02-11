import { h, Component } from 'preact';
import Paddle from './Paddle';
import Ball from './Ball';
import GameBoard from './Gameboard';
import Message from './Message';
import { 
  FRAME_RATE, 
  BOARD_SIZE,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_GUTTER,
  BALL_DIAMETER,
  COMPUTER_PADDLE_SPEED
} from '../utils/gameConstants';
import MenuMessage from './MenuMessage';
import { coinFlip, between, invert, half } from '../utils/helpers'

// TODOS
// - update to use game constants more/betterer
// - win condition
// - refactor messaging system
// - randomize initial ball y velocity
// - refactor/modularize in general
// - paddle delta
// - paddle edge collisions
// - handle player speed, follow cursor instead of BE cursor
// - handle mouse reentry
// - randomly move computer around at start screen
// - improve computer paddle behavior
// - collision sounds
// - win/lose sounds

const initialState = {
  frame: 0,
  playing: false,
  player: {
    score: 0,
    position: {
      x: PADDLE_GUTTER,
      y: half(BOARD_SIZE) - half(PADDLE_HEIGHT)
    }
  },
  computer: {
    score: 0,
    speed: COMPUTER_PADDLE_SPEED,
    position: {
      x: BOARD_SIZE - PADDLE_GUTTER - PADDLE_WIDTH,
      y: 50
    }
  },
  ball: {
    position: {
      x: half(BOARD_SIZE) - half(BALL_DIAMETER),
      y: half(BOARD_SIZE) - half(BALL_DIAMETER)
    },
    velocity: {
      x: 0,
      y: 0
    }
  }
};

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
      if (this.state.ball.position.x <= -BALL_DIAMETER) {
        this.scorePoint('computer');
        this.resetBall();
      } else if (this.state.ball.position.x >= BOARD_SIZE) {
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
      y: -2 // TO DO randomize
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
      paddleCheckPositionX += PADDLE_WIDTH; // offset for paddle width
    } else if (entity === 'computer') {
      ballCheckPositionX += BALL_DIAMETER; // offset for ball diameter
    }
    const ballVelocityX = this.state.ball.velocity.x;
    const inRangeAdjustedForVelocity = between(paddleCheckPositionX - Math.abs(ballVelocityX), paddleCheckPositionX + Math.abs(ballVelocityX));
    if (
      inRangeAdjustedForVelocity(ballCheckPositionX)
      && between(paddleCheckPositionYMin, paddleCheckPositionYMax)(ballCheckPositionY)
    ) {
      const invertedVelocityX = invert(this.state.ball.velocity.x);
      this.updateXY('ball', 'velocity', { x: invertedVelocityX });
      // corner hits
      if (
        between(paddleCheckPositionYMin, paddleCheckPositionYMin + 5)(ballCheckPositionY)
        || between(paddleCheckPositionYMax, paddleCheckPositionYMin - 5)(ballCheckPositionY)
      ) {
        const velMultiplier = 1.1; // TODO avoid magic constant
        this.updateXY('ball', 'velocity', { y: this.state.ball.velocity.y * velMultiplier });
      }
      this.speedUpBall();
    }
  }
  checkBallWallCollision() {
    const ballPositionY = this.state.ball.position.y;
    if (ballPositionY <= 0 || ballPositionY >= (BOARD_SIZE - BALL_DIAMETER)) {
      const invertedVelocityY = invert(this.state.ball.velocity.y);
      this.updateXY('ball', 'velocity', { y: invertedVelocityY });
    }
  }
  computerFollowBall() {
    const ballPositionY = this.state.ball.position.y;
    const computerPositionY = this.state.computer.position.y;
    const computerPositionYOffset = computerPositionY + half(PADDLE_WIDTH);
    let paddleMovement = 0;
    if (ballPositionY > computerPositionYOffset + 1 && (computerPositionY < (BOARD_SIZE - PADDLE_HEIGHT))) { // 1 offset for glitchiness
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

  render({}, { player, computer, ball, playing }) {
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