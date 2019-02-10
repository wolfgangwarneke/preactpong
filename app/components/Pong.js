import { h, render, Component } from 'preact';
import Paddle from './Paddle';
import Ball from './Ball';
import GameBoard from './Gameboard';
import { FRAME_RATE } from '../gameConstants';

// TODOS
// - win condition
// - speed up ball each volley
// - randomize initial ball y velocity
// - paddle delta
// - paddle edge collisions
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
    speed: 2,
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
      this.computerFollowBall();
      this.updateBall();
      if (this.state.ball.position.x === -10) {
        this.scorePoint('computer');
        this.resetBall();
      } else if (this.state.ball.position.x === 500) {
        this.scorePoint('player');
        this.resetBall();
      }
    }
  }
  handleMouseMove(e) {
    this.updateXY('player', 'position', { y: e.offsetY });
  }
  handleClick() {
    this.setState({
      playing: true
    });
    this.launchBall();
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
    let paddleCheckPositionYMin = this.state[entity].position.y;
    let paddleCheckPositionYMax = paddleCheckPositionYMin + 50;
    if (entity === 'player') {
      paddleCheckPositionX += 5; // offset for paddle width
    } else if (entity === 'computer') {
      ballCheckPositionX += 5; // offset for ball width
    }
    if (
      ballCheckPositionX === paddleCheckPositionX 
      && between(paddleCheckPositionYMin, paddleCheckPositionYMax)(ballCheckPositionY)
    ) {
      const invertedVelocityX = this.state.ball.velocity.x * -1; // REFACTOR
      this.updateXY('ball', 'velocity', { x: invertedVelocityX });
    }
  }
  checkBallWallCollision() {
    const ballPositionY = this.state.ball.position.y;
    if (ballPositionY === 0 || ballPositionY === 490) {
      const invertedVelocityY = this.state.ball.velocity.y * -1; // REFACTOR
      this.updateXY('ball', 'velocity', { y: invertedVelocityY });
    }
  }
  computerFollowBall() {
    const ballPositionY = this.state.ball.position.y;
    const computerPositionY = this.state.computer.position.y;
    const computerPositionYOffset = computerPositionY + 25;
    let paddleMovement = 0;
    if (ballPositionY > computerPositionYOffset) {
      paddleMovement = this.state.computer.speed;
    } else if (ballPositionY < computerPositionYOffset) {
      paddleMovement = invert(this.state.computer.speed);
    }
    this.updateXY('computer', 'position', {
      y: computerPositionY + paddleMovement
    });
  }

  render({}, { message, player, computer, ball }) {
    return (
      <GameBoard onMouseMove={this.handleMouseMove} onClick={this.handleClick}>
        {message} Player: {player.score} Computer: {computer.score}
        <Paddle position={player.position} />
        <Paddle position={computer.position} />
        <Ball position={ball.position} />
      </GameBoard>
    )
  }
}