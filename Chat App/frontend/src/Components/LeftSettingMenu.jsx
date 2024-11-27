import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Components.css';
import assets from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

export default function LeftSettingMenu({ settings, onSettingSelect }) {

  
  axios.defaults.baseURL = 'http://localhost:5000';
  const [user, setUser] = useState({ username: '', ProfileimageName: '', avatar: '' });
  const [activeMenu, setActiveMenu] = useState(null);
  const avatarPath = user.ProfileimageName 
    ? `http://localhost:5000/public/uploads/${user.ProfileimageName}.jpg` 
    : assets.BUser;

  const navigate = useNavigate();

  const LeftMenu = [
    { id: 1, name: "All Chats", activeNumber: '?' },
    { id: 2, name: "Profile", activeNumber: 0 },
    { id: 3, name: "Settings", activeNumber: 0 }
];


const fetchUserData = useCallback(async () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  try {
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
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


useEffect(() => {
  fetchUserData();
}, [fetchUserData]);



const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  navigate('/login', { replace: true });
};

const handleMouseLeave = () => {
  setActiveMenu(null);
};


const handleMouseEnter = (id) => {
  setActiveMenu(id);
};




  return (
    <div className='sidebarBg-menu'>
            <div className='sidebar-menu'>
                <div className="work-icon-logo">
                    <div className="icon logoicon">
                        <img
                            src={user.avatar ? avatarPath : assets.User}
                            alt=""
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
                                  <Link to="/home" className="profile-link">
                                    <div className="icon">
                                        <img
                                            src={activeMenu === menuItem.id ? assets.workWhiteIcon : assets.workGreyIcon}
                                            alt={menuItem.name}
                                        />
                                        <p className="work-text">{menuItem.name}</p>
                                    </div>
                                    </Link>
                                )}

                                {menuItem.name === "Settings" && (
                                    <div className="icon  active">
                                        <img
                                            src={activeMenu === menuItem.id ? assets.WSetting : assets.WSetting}
                                            alt={menuItem.name}
                                        />
                                        <p className="work-text">{menuItem.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="work-icon">
                    <div className="icon" onClick={handleLogout}>
                        <img
                            src={assets.LogoutIcon}
                            alt=""
                        />
                        <p className="work-text">Log out</p>
                    </div>
                </div>
            </div>


            <div className="sidebar">

                <div className="sidebar-top">
                        <div className="search-bar">
                            <h1><u>Settings</u></h1>
                        </div>
                    </div>

                <div className="chat-section">
                    <ul className="chat-list">
                    {settings.map(setting => (
                        <li
                            key={setting.id}
                            className="chat-item"
                            onClick={() => onSettingSelect(setting)} // Pass the whole setting object
                        >
                            <div className="profile-pic">
                            {setting.pic ? (
                                <img
                                src={setting.pic} // Use setting.pic directly
                                alt={setting.name}
                                className="setting-icon"
                                />
                            ) : (
                                <div className="default-icon">No Icon</div>
                            )}
                            </div>
                            <div className="chat-info">
                            <div className="chat-header">
                                <span className="chat-name">{setting.name}</span>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>

            
        </div>
  )
}
