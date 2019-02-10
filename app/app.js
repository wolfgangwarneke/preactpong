import { h, render, Component } from 'preact';
import Pong from './components/Pong';

render((
  <div id="pong-app">
    <h1 style={{ fontFamily: 'monospace', color: '#999' }}>Preact Pong</h1>
    <Pong />
  </div>
), document.getElementById('app'));
