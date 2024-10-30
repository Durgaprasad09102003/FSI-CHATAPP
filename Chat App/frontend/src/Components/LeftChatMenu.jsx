import React from 'react';
import './Components.css';
import assets from '../assets/assets.js';
import { useState } from 'react';

export default function LeftChatMenu() {
    const [activeMenu, setActiveMenu] = useState(null);

    const handleMouseEnter = (id) => {
        setActiveMenu(id);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    const chats = [
        { id: 1, name: 'Design chat', message: 'Jessie Rollins sent...', time: '4m', unread: true, isGroup: true },
        { id: 2, name: 'Osman Campos', message: 'Hey! We are ready...', time: '20m', unread: false },
        { id: 3, name: 'Jayden Church', message: 'I prepared some vari...', time: '1h', unread: true },
        { id: 4, name: 'Jacob Mcleod', message: 'And send me the proto...', time: '10m', unread: false },
        { id: 5, name: 'Jasmin Lowery', message: "Ok! Let's discuss it...", time: '20m', unread: false },
        { id: 6, name: 'Zaid Myers', message: 'Hey! We are ready to...', time: '45m', unread: false },
        { id: 7, name: 'Anthony Cordanes', message: 'What do you think?', time: '1d', unread: false },
        { id: 8, name: 'Conner Garcia', message: 'I think it would be...', time: '2d', unread: false },
        { id: 9, name: 'Vanessa Cox', message: 'Voice message', time: '2d', unread: false },
        { id: 10, name: 'Vanessa Cox', message: 'Voice message', time: '2d', unread: false },
        { id: 11, name: 'Vanessa Cox', message: 'Voice message', time: '2d', unread: false },
      ];
      

      const LeftMenu = [
        {id:1, name:"All Chats", whiteImgLink:assets.workWhiteIcon, greyImgLink:assets.workGreyIcon, activeNumber:10},
        {id:2, name:"Status", whiteImgLink:assets.workWhiteIcon, greyImgLink:assets.workGreyIcon, activeNumber:5},
        {id:3, name:"Calls", whiteImgLink:assets.workWhiteIcon, greyImgLink:assets.workGreyIcon, activeNumber:3},
        {id:4, name:"Profile", whiteImgLink:assets.workWhiteIcon, greyImgLink:assets.workGreyIcon, activeNumber:0},
        {id:5, name:"Settings", whiteImgLink:assets.workWhiteIcon, greyImgLink:assets.workGreyIcon, activeNumber:0}
      ]

  return (
    <div className='sidebarBg-menu'>






        <div className='sidebar-menu'>

            <div className="work-icon-logo">
                <div className="icon logoicon">
                <img
                    src={assets.DPLogo}
                    alt=""
                />
                </div>
            </div>

            <div>
            {LeftMenu.map((menuItem) => (
                <div
                key={LeftMenu.id}
                className="work-icon-container"
                onMouseEnter={() => handleMouseEnter(menuItem.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setActiveMenu(menuItem.id)}
                >
                    
                <div className="work-icon">
                    <div className={`${menuItem.activeNumber ? 'notification-badge' : 'd-n'}`}>{menuItem.activeNumber}</div>
                    <div className="icon">
                    <img
                        src={activeMenu === menuItem.id ? assets.workWhiteIcon : assets.workGreyIcon}
                        alt={menuItem.name}
                    />
                    
                <p className="work-text">{menuItem.name}</p>
                    </div>
                </div>
                </div>
            ))}

            </div>
            
            <div className="work-icon">
                <div className="icon">
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
                <input type="text" placeholder="Search" />
                </div>
            </div>
        
            <div className="chat-section">
                <ul className="chat-list">
                {chats.map(chat => (
                    <li key={chat.id} className="chat-item">
                    <div className="profile-pic">
                        <img src="" alt="" />
                    </div>
                    <div className="chat-info">
                        <div className="chat-header">
                        <span className="chat-name">{chat.name}</span>
                        <span className="chat-time">{chat.time}</span>
                        </div>
                        <div className="chat-message">{chat.message}</div>
                    </div>
                    {chat.unreadCount && <span className="unread-count">{chat.unreadCount}</span>}
                    {chat.isStarred && <span className="star-icon">★</span>}
                    </li>
                ))}
                </ul>
            </div>

        
        </div>









    </div>
  )
}




