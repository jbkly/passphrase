import React from 'react';
import logo from './logo.svg';

import TextField from '@material-ui/core/TextField';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Passphrase</h1>
        <span className="lead">Instantly generate secure, memorable passphrases</span>
      </header>
      <main>
        <section>
          <TextField
            label="Your next passphrase"
            className="generated"
            margin="normal"
            variant="filled"
          />
        </section>
      </main>
      <footer>
        <img src={logo} className="App-logo" alt="logo" />
      </footer>
    </div>
  );
}

export default App;
