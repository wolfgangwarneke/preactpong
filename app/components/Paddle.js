import { h, render, Component } from 'preact';

const paddleStyle = {
  pointerEvents: 'none',
  width: 5,
  height: 50,
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