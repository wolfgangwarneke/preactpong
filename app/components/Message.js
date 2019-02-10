import { h, render, Component } from 'preact';

const baseStyle = {
  position: 'absolute',
  top: 0,
  padding: "2 5"
};

export default (props) => {
  if (props.left) {
    return <div style={{...baseStyle, left: 0, ...props.style}}>{props.children}</div>
  } else if (props.right) {
    return <div style={{...baseStyle, right: 0, ...props.style}}>{props.children}</div>
  } else {
    return <div style={{...baseStyle, ...props.style}}>{props.children}</div>
  }
}