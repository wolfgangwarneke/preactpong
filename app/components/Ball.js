import { h, render, Component } from 'preact';
import { BALL_DIAMETER, BOARD_SIZE } from '../gameConstants';

const ballStyle = {
  width: BALL_DIAMETER,
  height: BALL_DIAMETER,
  borderRadius: 50,
  backgroundColor: 'white',
  position: 'absolute'
};

const initialState = {
  top: BOARD_SIZE/2 - BALL_DIAMETER/2,
  left: BOARD_SIZE/2 - BALL_DIAMETER/2,
  velocity: {
    x: 1,
    y: 2
  },
  lastFrame: 0
};

const between = (min, max) => num => (num >= min) && (num <= max);
const withinBoardRange = offset => between(0, BOARD_SIZE-offset);
const ballWithinBoardRange = withinBoardRange(BALL_DIAMETER);
const ballOnBoard = (top, left) => ballWithinBoardRange(top) && ballWithinBoardRange(left);

export default class Ball extends Component {
  constructor(props) {
    super(props)
    this.state = initialState;
    this.updateDatePosition = this.updateDatePosition.bind(this);
  }
  componentWillReceiveProps(props) {
    if (props.frame > this.state.lastFrame) {
      this.setState({ lastFrame: props.frame })
      this.updateDatePosition();
    }
  }
  updateDatePosition() {
    // console.log(this.state.velocity.x);
    if (ballOnBoard(this.state.top, this.state.left)) {
      this.setState({
        top: this.state.top + this.state.velocity.y,
        left: this.state.left + this.state.velocity.x
      });
    } else {
      console.log('should flip velocity');
      const newVelocity = {
        x: ballWithinBoardRange(this.state.left) ? this.state.velocity.x : (this.state.velocity.x * -1),
        y: ballWithinBoardRange(this.state.top) ? this.state.velocity.y : (this.state.velocity.y * -1)
      };
      this.setState({
        top: (this.state.top + newVelocity.y),
        left: (this.state.left + newVelocity.x),
        velocity: newVelocity
      });
    }
    if ((this.state.left < 50) || (this.state.left > (BOARD_SIZE - 50))) {
      this.props.reportPosition({
        top: this.state.top,
        left: this.state.left
      }, (() => {
        // TODO REFACTOR THIS
        console.log('should flip velocity');
        const newVelocity = {
          x: (this.state.velocity.x * -1),
          y: (this.state.velocity.y)
        };
        this.setState({
          top: (this.state.top + newVelocity.y),
          left: (this.state.left + newVelocity.x),
          velocity: newVelocity
        });
      }).bind(this));
    }
    // console.log('this.state', this.state);
  }
  render({frame}, { top, left }) {
    return (
      <div style={{...ballStyle, top, left }} frame={frame}></div>
    )
  }
}