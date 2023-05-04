import './App.css';
import { Link } from "react-router-dom";
import React from 'react';


function App() {

  return (
    <div className='App'>
      <h1>Welcome to Calendar!</h1>
      <h3>Manage events, scheduling, and your calendar!</h3>
      <h5 className='credit'>By Derek, James, and Kevin</h5>
      <Link to="/Login">
        <button type="button">
          Login
        </button>
      </Link>
    </div>
  );
}

export default App;