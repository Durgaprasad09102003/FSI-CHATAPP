import React, { useState, useEffect } from 'react';
import './Login.css';
import assets from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({Log}) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLogin, setIsLogin] = useState(Log);
    const [inputMsg, setInputMsg] = useState('');
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [isSendEnabled, setIsSendEnabled] = useState(false); // State for send button

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    // Format the time to show hours and minutes
    const formattedTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // Set to false for 24-hour format
    });

    const [loginMessages, setLoginMessages] = useState([
        {
            id: 1,
            type: 'input',
            inputType: 'text',
            placeholder: 'Enter Username',
            receiverMsg: 'Enter Username',
            senderMsg: ''
        },
        {
            id: 2,
            type: 'input',
            inputType: 'password',
            placeholder: 'Enter Password',
            receiverMsg: 'Enter Password',
            senderMsg: ''
        },
        {
            id: 3,
            type: 'message',
            receiverMsg: 'You Successfully Logged in',
            senderMsg: ''
        }
    ]);

    const [registerMessages, setRegisterMessages] = useState([
        {
            id: 1,
            type: 'input',
            inputType: 'text',
            placeholder: 'Enter Username',
            receiverMsg: 'Enter Username',
            senderMsg: ''
        },
        {
            id: 2,
            type: 'input',
            inputType: 'email',
            placeholder: 'Enter Email',
            receiverMsg: 'Enter Email',
            senderMsg: ''
        },
        {
            id: 3,
            type: 'input',
            inputType: 'text',
            placeholder: 'Enter Phone Number',
            receiverMsg: 'Enter Phone Number',
            senderMsg: ''
        },
        {
            id: 4,
            type: 'input',
            inputType: 'date',
            placeholder: 'Enter Date of Birth',
            receiverMsg: 'Enter Date of Birth',
            senderMsg: ''
        },
        {
            id: 5,
            type: 'input',
            inputType: 'password',
            placeholder: 'Create Password',
            receiverMsg: 'Create Password',
            senderMsg: ''
        },
        {
            id: 6,
            type: 'input',
            inputType: 'password',
            placeholder: 'Confirm Password',
            receiverMsg: 'Confirm Password',
            senderMsg: ''
        },
        {
            id: 7,
            type: 'message',
            receiverMsg: 'Registration Successfully Completed',
            senderMsg: ''
        }
    ]);

    const navigate = useNavigate();

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const toggleLog = () => {
        setIsLogin(!isLogin);
        setIsVisible(!isVisible);
        setCurrentMsgIndex(0);
        clearInputFields();
    };

    const clearInputFields = () => {
        setInputMsg('');
        const clearedLoginMessages = loginMessages.map(msg => {
            if (msg.type === 'input') {
                return { ...msg, senderMsg: '' };
            }
            return msg;
        });
        setLoginMessages(clearedLoginMessages);

        const clearedRegisterMessages = registerMessages.map(msg => {
            if (msg.type === 'input') {
                return { ...msg, senderMsg: '' };
            }
            return msg;
        });
        setRegisterMessages(clearedRegisterMessages);
    };

    const validateInput = (value) => {
        const currentMessage = isLogin ? loginMessages[currentMsgIndex] : registerMessages[currentMsgIndex];
        switch (currentMessage.inputType) {
            case 'text':
                return value.trim() !== ''; // Username must not be empty
            case 'email':
                return /\S+@\S+\.\S+/.test(value); // Simple email regex
            case 'password':
                return value.length >= 6; // Password must be at least 6 characters
            case 'date':
                return value.trim() !== ''; // Date must not be empty
                case 'tel':
                    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value); // Phone number regex    
            default:
                return true;
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputMsg(value);
        setIsSendEnabled(validateInput(value)); // Validate input on change
    };

    const handleLoginMessages = () => {
        const updatedMessages = [...loginMessages];
        if (updatedMessages[currentMsgIndex].type === 'input') {
            updatedMessages[currentMsgIndex].senderMsg = inputMsg;
        }
        setLoginMessages(updatedMessages);
        setInputMsg('');
        if (currentMsgIndex === 1) {
            setTimeout(() => {
                setCurrentMsgIndex(currentMsgIndex + 1);
            }, 500);
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } else if (currentMsgIndex < loginMessages.length - 1) {
            setCurrentMsgIndex(currentMsgIndex + 1);
        }
    };

    const handleRegisterMessages = () => {
        const updatedMessages = [...registerMessages];
        if (updatedMessages[currentMsgIndex].type === 'input') {
            updatedMessages[currentMsgIndex].senderMsg = inputMsg;
        }
        setRegisterMessages(updatedMessages);
        setInputMsg('');
        if (currentMsgIndex === registerMessages.length - 2) {
            setTimeout(() => {
                updatedMessages[currentMsgIndex + 1].senderMsg = '';
                setCurrentMsgIndex(currentMsgIndex + 1);
                setRegisterMessages(updatedMessages);
            }, 500);
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } else if (currentMsgIndex < registerMessages.length - 1) {
            setCurrentMsgIndex(currentMsgIndex + 1);
        }
    };

    const sendMsg = () => {
        if (!isSendEnabled || inputMsg.trim() === '') return; // Prevent sending if not enabled
        if (isLogin) {
            handleLoginMessages();
        } else {
            handleRegisterMessages();
        }
    };

    const currentMessages = isLogin ? loginMessages : registerMessages;

    return (
        <div className='d-f fd-c jc-c ai-c ChatTheme'>
            <div className='d-f fd-c chat-box'>
                <div className='d-f fd-r ai-c jc-sb login-details'>
                    <div className='d-f fd-r ai-c login-details-bar'>
                        <img src={assets.User} alt="" />
                        <h2>{isLogin ? 'Login' : 'Register'}</h2>
                    </div>
                    <div className='other-log'>
                        <img src={assets.more} alt="" id="otherlogmenu" onClick={toggleVisibility} />
                        {isVisible && (
                            <div className="otherLogDetails" id="logoption" onClick={toggleLog}>
                                {isLogin ? <Link to="/register">register</Link> : <Link to="/login">Login</Link> }
                            </div>
                        )}
                    </div>
                </div>
                <div className='d-f fd-c ai-c Chat-Login-menu'>
                    <div className='d-f fd-r chat-window'>
                        {currentMessages.slice(0, currentMsgIndex + 1).map((msg) => (
                            <div key={msg.id}>
                                <div className='r-msg'>
                                    <div className='msg'>{msg.receiverMsg}</div>
                                    <div>
                                        <img src={assets.BUser} alt="User Icon" />
                                        <p>{formattedTime}</p>
                                    </div>
                                </div>
                                {msg.senderMsg && msg.type === 'input' && (
                                    <div className='s-msg'>
                                        <div className='msg'>{msg.senderMsg}</div>
                                        <div>
                                            <img src={assets.BUser } alt="" />
                                            <p>{formattedTime}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {currentMessages[currentMsgIndex]?.type === 'input' && (
                        <div>
                            <input
                                type={currentMessages[currentMsgIndex].inputType}
                                placeholder={currentMessages[currentMsgIndex].placeholder}
                                value={inputMsg}
                                onChange={handleInputChange}
                            />
                            <button 
                                className="send-button" 
                                style={{ opacity: isSendEnabled ? 1 : 0.3 }}
                                onClick={sendMsg}
                            >
                                <img src={assets.SendArrow} alt="" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}