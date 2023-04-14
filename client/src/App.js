import { GoogleLogin } from '@react-oauth/google';
import React from 'react';

function App() {
  return (
    <div className="App">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const response = await fetch('http://localhost:3001/oauth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentialResponse)
          })
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  )
}

export default App