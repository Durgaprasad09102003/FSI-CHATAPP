import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import assets from '../assets/assets';
import './Components.css';

export default function MainChatContent({ selectedUser }) {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({ id: '', username: '', avatar: '', phoneNumber: '' });
  const [chats, setChats] = useState([]);
  
  const [isVisible, setIsVisible] = useState(false);

  const [inputMessage, setInputMessage] = useState('');

  const avatarPath = user.avatar ? `http://localhost:5000/public/uploads/${user.phoneNumber}.jpg` : assets.BUser;
  const notify = (message, type) => {
    toast[type](message); // Show toast with the appropriate type
};

const toggleVisibility = () => {
  setIsVisible(!isVisible);
};


useEffect(() => {
  // Fetch user data and chats when the component mounts
  const fetchData = async () => {
    try {
      // Fetch user data
      const userResponse = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        username: userResponse.data.username || 'Digitalpulse',
        phoneNumber: userResponse.data.phoneNumber,
        avatar: userResponse.data.avatar,
      });

      // Fetch chats data
      const chatResponse = await axios.get(`http://localhost:5000/api/chats/${userId}`);
      const sortedChats = chatResponse.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setChats(sortedChats);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data.');
    }
  };

  fetchData();

  // Set up polling for new messages every 3 seconds
  const interval = setInterval(() => {
    fetchChats();
  }, 3000);

  // Cleanup interval on component unmount
  return () => clearInterval(interval);
}, [userId, token]);

// Fetch chats from the server
const fetchChats = async () => {
  try {
    const chatResponse = await axios.get(`http://localhost:5000/api/chats/${userId}`);
    const sortedChats = chatResponse.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    setChats(sortedChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
  }
};

const handleClearChat = async () => {
  setIsVisible(!isVisible);

  try {
    const clearData = {
      receiverId: selectedUser?.onclickrevid,
      userId: userId,
    };

    await axios.delete('http://localhost:5000/api/chats/clearchat', {
      data: clearData, // Attach data here for DELETE request
    });

    notify('Chat cleared successfully', 'success');
  } catch (error) {
    console.error('Error clearing chat:', error);
    notify('Failed to clear chat', 'error');
  }
};


const messageSendButton = async () => {
  console.log(inputMessage);

  if (inputMessage.trim() === '') {
    toast.error('Please enter a message.');
    return;
  }

  // Prepare message data
  const messageData = {
    message: inputMessage,
    receiverId: selectedUser?.onclickrevid,
  };

  try {
    // Send the POST request
    const responseMessageData = await axios.post(`http://localhost:5000/api/chats/messageData/${userId}`, messageData);

    if (responseMessageData.data.success) {
      notify('Message sent', 'success');
      
      // Add the new message to the chats array
      setChats((chats) => [
        ...chats,
        {
          senderId: userId,
          receiverId: selectedUser?.onclickrevid,
          message: inputMessage,
          timestamp: Date.now(),
        },
      ]);

      setInputMessage(''); // Clear the input field after sending the message
    }
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
  }
};
  
  


  return (
    <div className="d-f fd-c ai-c MainChatContent">
      <div className="mainContentBody">
        <div className="MainBodyChat">
          <div className="chatHeaderDetails">
            <div className="d-f fd-r ai-c jc-c">
              <img src={assets.BUser} alt="User Icon" />
              <h2>{selectedUser?.displayName || 'DIGITALPULSE'}</h2>
            </div>
            <img src={assets.moreWide} alt="More Options Icon" onClick={toggleVisibility}/>
            {isVisible && (
              <button onClick={handleClearChat}>Clear chat</button>
            )}
          </div>

          <div className="SenderReceiverBody">
          {chats.map((chat, index) => {
            const isSender = chat.senderId?._id === userId;
            const isSender1 = chat.senderId?._id === userId;
            const isSender2 = chat.senderId?._id === selectedUser?.onclickrevid;
            const isReceiver1 = chat.receiverId?._id === selectedUser?.onclickrevid;
            const isReceiver2 = chat.receiverId?._id === userId;
            const messageTime = new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if((isSender1 && isReceiver1) || (isSender2 && isReceiver2))
              return (
                <div key={index} className={isSender ? 's-msg' :  'r-msg' }>

                  <div className="msg">{chat.message}</div>
                  <div>
                    <img
                      src={isSender
                        ? (user.avatar ? avatarPath : assets.BUser)
                        : (selectedUser?.displayAvatar || assets.BUser)}
                      alt="User Icon"
                    />
                    <p>{messageTime}</p>
                  </div>
                </div>
              );
            

            return null; // Skip rendering if neither sender nor receiver
          })}

          </div>
        </div>

          <div className="d-f fd-r ai-c jc-c DataInputBox">
            <input 
              type="text" 
              placeholder="Type your message here..." 
              value={inputMessage} 
              onChange={(e) => setInputMessage(e.target.value)} 
            />
            <button onClick={messageSendButton}>
            <img src={assets.SendArrow} alt="Send Icon" />
          </button>
          </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
