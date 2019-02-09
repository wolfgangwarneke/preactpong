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
  left: BOARD_SIZE/2 - BALL_DIAMETER/2
};

export default class Ball extends Component {
  constructor(props) {
    super(props)
    this.setState(initialState)
  }
  render({posX, posY}, { top, left }) {
    console.log(posX, posY, top, left);
    return (
      <div style={{...ballStyle, left: posX || left, top: posY || top }}></div>
    )
  }
}