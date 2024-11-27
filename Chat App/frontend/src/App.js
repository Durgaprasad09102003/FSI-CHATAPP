import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login/Login.jsx';
import MainChat from './Pages/Chatmenu/MainChat.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import Settings from './Pages/Settings/Settings.jsx';
function App() {
  return (
    <>
        <Routes>
          <Route path="*" element={<Login Log={true} />} />
          <Route path="/login" element={<Login Log={true} />} />
          <Route path="/register" element={<Login Log={false} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<MainChat/>} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
    </>
  );
}

export default App;
