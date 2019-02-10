import { h, render, Component } from 'preact';
import DumbPaddle from './DumbPaddle';
import DumbBall from './DumbBall';
import DumbGameBoard from './DumbGameboard';
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
  playing: false,
  player: {
    position: {
      x: 10,
      y: 250
    }
  },
  computer: {
    position: {
      x: 410,
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
    // if ball on player side checkCollision(player)
    // if ball on paddle side checkCollision(computer)
    // if ball out of left bounds scorePoint(player)
    // if ball out of right bounds scorePoint(computer)
    if (this.state.playing) {
      this.updateBall();
    }
  }
  handleMouseMove(e) {
    this.updateXY('player', 'position', { y: e.offsetY });
  }
  handleClick() {
    this.setState({
      playing: !this.state.playing
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
  launchBall() {
    this.updateXY('ball', 'velocity', {
      x: 1,
      y: -2
    });
  }
  updateBall() {
    // check collision with player
    // check collision with computer
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

  render({}, { message, player, computer, ball }) {
    return (
      <DumbGameBoard onMouseMove={this.handleMouseMove} onClick={this.handleClick}>
        {message}
        <DumbPaddle position={player.position} />
        <DumbPaddle position={computer.position} />
        <DumbBall position={ball.position} />
      </DumbGameBoard>
    )
  }
}