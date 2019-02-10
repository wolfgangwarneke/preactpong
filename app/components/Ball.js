import { h, render, Component } from 'preact';

const ballStyle = {
  borderRadius: '50%',
  backgroundColor: '#fff',
  position: 'absolute',
  width: 10,
  height: 10
}

export default (props) => {
  const left = props.position.x || 0;
  const top = props.position.y || 0;
  return (
    <div {...props} style={{...ballStyle, top, left}}></div>
  )
}