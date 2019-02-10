import { h, render, Component } from 'preact';
import Pong from './components/Pong';

render((
  <div id="pong-app">
    <h1 style={{ fontFamily: 'monospace' }}>Preact Pong</h1>
    <Pong />
  </div>
), document.getElementById('app'));
