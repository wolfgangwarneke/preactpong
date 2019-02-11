import { h } from 'preact';
import { BALL_DIAMETER } from '../utils/gameConstants';

const ballStyle = {
  pointerEvents: 'none',
  borderRadius: '50%',
  backgroundColor: '#fff',
  position: 'absolute',
  width: BALL_DIAMETER,
  height: BALL_DIAMETER
}

export default (props) => {
  const left = props.position.x || 0;
  const top = props.position.y || 0;
  return (
    <div {...props} style={{...ballStyle, top, left}}></div>
  )
}