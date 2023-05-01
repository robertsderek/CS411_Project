import './App.css';
import { Link } from "react-router-dom";
import React from 'react';


function App() {

  return (
    <div>
      <h1>Welcome to my Calendar!</h1>
      <h3>Manage events, scheduling, and your calendar!</h3>
      <h6>By Dereck, James, and Kevin</h6>
      <Link to="/Login">
        <button type="button">
          Login
        </button>
      </Link>
    </div>
  );
}

export default App;