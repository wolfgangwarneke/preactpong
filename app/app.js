import { h, render, Component } from 'preact';
import GameBoard from './components/GameBoard';

render((
  <div id="pong-app">
    <h1>Preact Pong</h1>
    <GameBoard>

    </GameBoard>
  </div>
), document.getElementById('app'));
