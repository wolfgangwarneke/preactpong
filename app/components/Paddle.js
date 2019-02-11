import { h } from 'preact';
import { PADDLE_WIDTH, PADDLE_HEIGHT } from '../utils/gameConstants';

const paddleStyle = {
  pointerEvents: 'none',
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  backgroundColor: 'white',
  position: 'absolute'
};

export default (props) => {
  const left = props.position.x || 0;
  const top = props.position.y || 0;
  return (
    <div {...props} style={{...paddleStyle, top, left}}></div>
  )
}