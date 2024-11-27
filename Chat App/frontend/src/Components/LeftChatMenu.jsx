import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Components.css';
import assets from '../assets/assets.js';
import { Link, useNavigate } from 'react-router-dom';

export default function LeftChatMenu({ onUserSelect, addContentListener }) {
  axios.defaults.baseURL = 'http://localhost:5000';

  const [chats, setChats] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [user, setUser] = useState({ username: '', avatar: '', ProfileimageName: '' });
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const avatarPath = user.avatar
    ? `http://localhost:5000/public/uploads/${user.ProfileimageName}.jpg`
    : assets.User;
  const navigate = useNavigate();

  const handleMouseEnter = (id) => {
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleAddContactClick = () => {
    addContentListener();
    toggleVisibility(); // Call to toggle visibility
  };

  const LeftMenu = [
    { id: 1, name: "All Chats", activeNumber: '?' },
    { id: 2, name: "Profile", activeNumber: 0 },
    { id: 3, name: "Settings", activeNumber: 0 }
  ];

  const fetchUserData = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser({
        username: response.data.username || 'Digitalpulse',
        ProfileimageName: response.data.phoneNumber,
        avatar: response.data.avatar
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data.');
    }
  }, []);

  const fetchChats = useCallback(async () => {
    try {
      const response = await axios.get('/api/chats/chatsData');
      if (response.status === 200 && Array.isArray(response.data)) {
        setChats(response.data);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
      toast.error('Failed to load chats. Please try again later.');
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchChats();

    // Polling every 5 seconds to fetch new chat data
    const intervalId = setInterval(() => {
      fetchChats();
    }, 5000);

    // Cleanup polling interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchUserData, fetchChats]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  const userId = localStorage.getItem('userId');

  const latestMessages = chats.reduce((acc, chat) => {
    const isSender = chat.senderId?._id === userId;
    const isReceiver = chat.receiverId?._id === userId;

    if ((isSender || isReceiver) && chat.senderId?._id !== chat.receiverId?._id) {
      const contactData = isSender ? chat.receiverId : chat.senderId;
      const contactId = contactData._id;

      if (!acc[contactId] || new Date(chat.timestamp) > new Date(acc[contactId].timestamp)) {
        acc[contactId] = {
          ...chat,
          onclickrevid: contactData?._id,
          displayName: contactData.username,
          displayAvatar: contactData.avatar ? `http://localhost:5000/public/uploads/${contactData.phoneNumber}.jpg` : assets.BUser,
          latestMessage: chat.message,
          latestTimestamp: chat.timestamp,
        };
      }
    }

    return acc;
  }, {});

  const latestChats = Object.values(latestMessages).sort((a, b) => new Date(b.latestTimestamp) - new Date(a.latestTimestamp));

  // Filtered chats based on search term
  const filteredChats = latestChats.filter(chat =>
    chat.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebarBg-menu">
      <div className="sidebar-menu">
        <div className="work-icon-logo">
          <div className="icon logoicon">
            <img
              src={avatarPath}
              alt="User Avatar"
            />
          </div>
        </div>

        <div>
          {LeftMenu.map((menuItem) => (
            <div
              key={menuItem.id}
              className="work-icon-container"
              onMouseEnter={() => handleMouseEnter(menuItem.id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => setActiveMenu(menuItem.id)}
            >
              <div className="work-icon">
                <div className={`${menuItem.activeNumber ? 'notification-badge' : 'd-n'}`}>
                  {menuItem.activeNumber}
                </div>

                {menuItem.name === "Profile" && (
                  <Link to="/profile" className="profile-link">
                    <div className="icon">
                      <img
                        src={activeMenu === menuItem.id ? assets.User : assets.GUser}
                        alt={menuItem.name}
                      />
                      <p className="work-text">{menuItem.name}</p>
                    </div>
                  </Link>
                )}

                {menuItem.name === "All Chats" && (
                  <div className="icon active">
                    <img
                      src={activeMenu === menuItem.id ? assets.workWhiteIcon : assets.workWhiteIcon}
                      alt={menuItem.name}
                    />
                    <p className="work-text">{menuItem.name}</p>
                  </div>
                )}

                {menuItem.name === "Settings" && (
                  <Link to="/settings" className="profile-link">
                    <div className="icon">
                      <img
                        src={activeMenu === menuItem.id ? assets.WSetting : assets.GSetting}
                        alt={menuItem.name}
                      />
                      <p className="work-text">{menuItem.name}</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="work-icon">
          <div className="icon" onClick={handleLogout}>
            <img
              src={assets.LogoutIcon}
              alt="Logout Icon"
            />
            <p className="work-text">Log out</p>
          </div>
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-top">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <img src={assets.Bmore} onClick={toggleVisibility} alt="More" />
            {isVisible && (
              <button onClick={handleAddContactClick}>Add Contact</button>
            )}
          </div>
        </div>

        <div className="chat-section">
          <ul className="chat-list">
            {filteredChats.map(chat => (
              <li key={chat._id} className="chat-item" onClick={() => onUserSelect(chat)}>
                <div className="profile-pic">
                  <img
                    src={chat.displayAvatar}
                    alt={`${chat.displayName}'s avatar`}
                  />
                </div>
                <div className="chat-info">
                  <div className="chat-header">
                    <span className="chat-name">{chat.displayName}</span>
                    <span className="chat-time">
                      {new Date(chat.latestTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="chat-message">{chat.latestMessage}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
