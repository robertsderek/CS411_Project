import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Calendar from './pages/Calendar';
import Login from './pages/Login'
import AddContent from './pages/AddContent';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path="/Calendar" element={<Calendar/>} />
        <Route path="/AddContent" element={<AddContent/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);