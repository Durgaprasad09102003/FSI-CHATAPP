import React from 'react';
import LeftChatMenu from '../../Components/LeftChatMenu';
import MainChatContent from '../../Components/MainChatContent';
import './MainChat.css';


const MainChat = () => {

  return (
    <div className='d-f jc-c ai-c mainChat'>
      <div className="d-f fd-r main-chat-container">
        <LeftChatMenu />
        <MainChatContent />
      </div>
    </div>
  );
};

export default MainChat;
