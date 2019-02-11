import { h, render, Component } from 'preact';
import Message from './Message';

const menuStyle = {
  width: 200,
  left: 150,
  top: 150,
  fontSize: 20,
  fontFamily: 'monospace',
  color: 'red',
  textAlign: 'center',
  pointerEvents: 'none',
  zIndex: 1
};

export default (props) => <Message style={menuStyle}>{props.children}</Message>
