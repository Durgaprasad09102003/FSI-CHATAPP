import React, { useState } from 'react';
import LeftChatMenu from '../../Components/LeftChatMenu';
import MainChatContent from '../../Components/MainChatContent';
import './MainChat.css';
import AddContact from '../../Components/AddContact';

const MainChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);

const addContentOperation = () => {
  setShowAddContact(!showAddContact);
};

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="d-f jc-c ai-c mainChat">
      <div className="d-f fd-r main-chat-container">
        <LeftChatMenu onUserSelect={handleUserSelect} addContentListener={addContentOperation} />
        <MainChatContent selectedUser={selectedUser} />
        {showAddContact && <AddContact addContentListener={addContentOperation}/>}
      </div>
    </div>
  );
};

export default MainChat;
