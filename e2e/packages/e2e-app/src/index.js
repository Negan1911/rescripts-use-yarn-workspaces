import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button } from 'e2e-ui/src/Components/Button';

function App() {
  return <div>
    <h1>This example imports a Button from <code>e2e-ui</code> package:</h1>
    <Button text="A Button!" />
  </div>
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);