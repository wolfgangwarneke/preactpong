import { h, render, Component } from 'preact';

const gameBoardStyle = {
  width: '500px',
  height: '500px',
  backgroundColor: 'blue',
  position: 'relative'
};

export default (props) => {
  return (
    <div {...props} style={gameBoardStyle}>
      {props.children}
    </div>
  )
}
