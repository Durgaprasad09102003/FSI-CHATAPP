import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login/Login.jsx';
import MainChat from './Pages/Chatmenu/MainChat.jsx';

function App() {
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login Log={true} />} />
          <Route path="/register" element={<Login Log={false} />} />
          <Route path="*" element={<Login Log={true} />} />
          <Route path="/home" element={<MainChat/>} />
        </Routes>
    </>
  );
}

export default App;
