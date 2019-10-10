import React from 'react';
import logo from './logo.svg';
import './App.css'
import './theme/dark.css';
import styled from 'styled-components';
import GameControls from './components/GameControls';

import * as Measures from './utility/measures';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <GameControls />
      </header>
    </div>
  );
}

export default App;
