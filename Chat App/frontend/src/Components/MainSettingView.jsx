import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import assets from '../assets/assets';
import { format } from 'date-fns';

export default function MainSettingView({ selectedSetting }) {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    avatar: '',
    bio: '',
  });

  const avatarPath = user.avatar ? `http://localhost:5000/public/uploads/${user.phoneNumber}.jpg` : assets.BUser;

  const personalData = [
    { id: 1, label: 'Username:', value: user.username },
    { id: 2, label: 'Email:', value: user.email },
    { id: 3, label: 'Phone Number:', value: user.phoneNumber },
    { id: 4, label: 'Date of Birth:', value: user.dateOfBirth },
    { id: 5, label: 'Avatar:', value: avatarPath },
    { id: 6, label: 'Bio:', value: user.bio },
  ];

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
          email: userResponse.data.email,
          phoneNumber: userResponse.data.phoneNumber || '',
          dateOfBirth: userResponse.data.dateOfBirth ? format(new Date(userResponse.data.dateOfBirth), 'dd-MM-yyyy') : '',
          avatar: userResponse.data.avatar || '',
          bio: userResponse.data.bio || '',
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data.');
      }
    };

    fetchData();
  }, [userId, token]);

  const renderPersonalInfo = () => {
    return personalData.map((item) => (
      <div key={item.id} className="message-container">
        {/* Sender Message */}
        <div className="r-msg">
          <div className="msg">{item.label}</div>
          <div>
            <img src={assets.BUser} alt="User Icon" />
            <p>00:00</p>
          </div>
        </div>

        {/* Receiver Message */}
        {item.value === avatarPath ? (
          <div className="s-msg">
            <img src={avatarPath} alt="Avatar Icon" className="msg-img" />
            <div>
              <img src={assets.BUser} alt="User Icon" />
              <p>00:00</p>
            </div>
          </div>
        ) : (
          <div className="s-msg">
            <div className="msg">{item.value}</div>
            <div>
              <img src={assets.BUser} alt="User Icon" />
              <p>00:00</p>
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="d-f fd-c ai-c MainChatContent">
      <div className="mainContentBody">
        <div className="MainBodyChat">
          <div className="chatHeaderDetails">
            <div className="d-f fd-r ai-c jc-c">
              {/* Check if selectedSetting is not null and has the pic property */}
              {selectedSetting?.pic ? (
                <img src={selectedSetting.pic} alt={selectedSetting.name} />
              ) : (
                <img src={assets.BUser} alt='' />
              )}
              <h2>{selectedSetting?.name || 'DIGITAL PULSE'}</h2>
            </div>
          </div>

          {/* Check if 'Personal Information' is selected */}
          {selectedSetting?.name === 'Personal Information' ? (
            <div className="SettingBody">{renderPersonalInfo()}</div>
          ) : (
            <div className="SettingBody">No Information Available</div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
