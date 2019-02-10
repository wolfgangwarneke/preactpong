import { h, render, Component } from 'preact';
import { BOARD_SIZE } from '../utils/gameConstants';

const gameBoardStyle = {
  width: BOARD_SIZE,
  height: BOARD_SIZE,
  backgroundColor: 'blue',
  position: 'relative',
  color: 'yellow',
  margin: 'auto',
  overflow: 'hidden'
};

export default (props) => {
  return (
    <div {...props} style={gameBoardStyle}>
      {props.children}
    </div>
  )
}
