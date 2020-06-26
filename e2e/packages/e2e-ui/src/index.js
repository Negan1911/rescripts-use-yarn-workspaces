import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button } from './Components/Button';



function App() {
  return <div>
    <h1>Components</h1>
    <h3>Button</h3>
    <Button text="A Button!" />
  </div>
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);