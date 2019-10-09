import React from 'react';
import logo from './logo.svg';
import * as Measures from './measures';
import './App.css';
import NumericSelector from './components/NumericSelector'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <NumericSelector default={4} options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} />
        <NumericSelector default={4} options={[1, 2, 4, 8, 16]} />
      </header>
    </div>
  );
}

export default App;
