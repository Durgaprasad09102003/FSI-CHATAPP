import React, { useState } from 'react';
import './Login.css';
import assets from '../../assets/assets';
import { Link} from 'react-router-dom';
import axios from 'axios';

export default function Login({ Log }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLogin, setIsLogin] = useState(Log);
    const [inputMsg, setInputMsg] = useState('');
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [isSendEnabled, setIsSendEnabled] = useState(false);

    const [loginMessages, setLoginMessages] = useState([
        {
            id: 1,
            type: 'input',
            inputType: 'text',
            placeholder: 'Enter Username',
            receiverMsg: 'Enter Username',
            senderMsg: '',
            timestamp: null,
        },
        {
            id: 2,
            type: 'input',
            inputType: 'password',
            placeholder: 'Enter Password',
            receiverMsg: 'Enter Password',
            senderMsg: '',
            timestamp: null,
        },
        {
            id: 3,
            type: 'message',
            receiverMsg: 'Thank you',
            senderMsg: '',
            timestamp: null,
        },
    ]);

    const [registerMessages, setRegisterMessages] = useState([
        {
            id: 1,
            type: 'input',
            inputType: 'text',
            placeholder: 'Enter Username',
            receiverMsg: 'Enter Username',
            senderMsg: '',
            timestamp: null,
        },
        {
            id: 2,
            type: 'input',
            inputType: 'email',
            placeholder: 'Enter Email',
            receiverMsg: 'Enter Email',
            senderMsg: '',
            timestamp: null,
        },
        {
            id: 3,
            type: 'input',
            inputType: 'text',
            placeholder: 'Enter Phone Number',
            receiverMsg: 'Enter Phone Number',
            senderMsg: '',
            timestamp: null,
        },
        {
            id: 4,
            type: 'input',
            inputType: 'date',
            placeholder: 'Enter Date of Birth',
            receiverMsg: 'Enter Date of Birth',
            senderMsg: '',
            timestamp: null,
        },
        {
            id: 5,
            type: 'input',
            inputType: 'password',
            placeholder: 'Create Password',
            receiverMsg: 'Create Password',
            senderMsg: '',
            timestamp: null,
        },
        {
            id: 6,
            type: 'input',
            inputType: 'password',
            placeholder: 'Confirm Password',
            receiverMsg: 'Confirm Password',
            senderMsg: '',
            timestamp: null,
        },
        {
            id: 7,
            type: 'message',
            receiverMsg: 'Thank you',
            senderMsg: '',
            timestamp: null,
        },
    ]);

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
        const clearedMessages = (isLogin ? loginMessages : registerMessages).map(msg => {
            if (msg.type === 'input') {
                return { ...msg, senderMsg: '', timestamp: null };
            }
            return msg;
        });
        if (isLogin) {
            setLoginMessages(clearedMessages);
        } else {
            setRegisterMessages(clearedMessages);
        }
    };

    const validateInput = (value) => {
        const currentMessage = isLogin ? loginMessages[currentMsgIndex] : registerMessages[currentMsgIndex];
        switch (currentMessage.inputType) {
            case 'text':
                return value.trim() !== '' || "Username cannot be empty";
            case 'email':
                return /\S+@\S+\.\S+/.test(value) || "Invalid email format";
            case 'password':
                return value.length >= 6 || "Password must be at least 6 characters";
            case 'date':
                return value.trim() !== '' || "Date of birth cannot be empty";
            case 'tel':
                return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value) || "Invalid phone number";
            default:
                return true;
        }
    };
    
    // In your handleInputChange, set an error message state
    const handleInputChange = (e) => {
        const value = e.target.value;
        const validation = validateInput(value);
        if (validation !== true) {
            // Show error message
            setInputMsg(validation); // Create a new state for input error messages
        } else {
            setInputMsg('');
        }
        setInputMsg(value);
        setIsSendEnabled(validation === true);
    };

    const handleLoginMessages = () => {
        const updatedMessages = [...loginMessages];
        if (updatedMessages[currentMsgIndex].type === 'input') {
            updatedMessages[currentMsgIndex].senderMsg = inputMsg;
            updatedMessages[currentMsgIndex].timestamp = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }
        setLoginMessages(updatedMessages);
        setInputMsg('');
        if (currentMsgIndex === 1) {
            setTimeout(() => {
                setCurrentMsgIndex(currentMsgIndex + 1);
            }, 500);
        } else if (currentMsgIndex < loginMessages.length - 1) {
            setCurrentMsgIndex(currentMsgIndex + 1);
        }
    };

    const handleRegisterMessages = () => {
        const updatedMessages = [...registerMessages];
        if (updatedMessages[currentMsgIndex].type === 'input') {
            updatedMessages[currentMsgIndex].senderMsg = inputMsg;
            updatedMessages[currentMsgIndex].timestamp = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }
        setRegisterMessages(updatedMessages);
        setInputMsg('');
        if (currentMsgIndex === registerMessages.length - 2) {
            setTimeout(() => {
                updatedMessages[currentMsgIndex + 1].senderMsg = '';
                setCurrentMsgIndex(currentMsgIndex + 1);
                setRegisterMessages(updatedMessages);
            }, 500);
        } else if (currentMsgIndex < registerMessages.length - 1) {
            setCurrentMsgIndex(currentMsgIndex + 1);
        }
    };

    const sendMsg = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        if (!isSendEnabled || inputMsg.trim() === '') return;
    
        if (isLogin) {
            handleLoginMessages();
            if (currentMsgIndex === loginMessages.length - 2) {
                    const userData = {
                        username: loginMessages[0].senderMsg,
                        password: loginMessages[1].senderMsg,
                    };
    
                    setInputMsg('');
                    try {
                        // Disable the send button while waiting for the response
                        setIsSendEnabled(false); 
    
                        const response = await axios.post('http://localhost:5000/api/users/login', userData);
    
                        console.log('Response from server:', response.data); // Log server response for debugging
    
                        if (response.data.success) {
                            window.location.href = '/home'; // Redirect on successful registration
                        } else {
                            setInputMsg(response.data.message || "Registration failed. Please try again.");
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error('Error registering user:', error); // Log error details
                        setInputMsg('Error registering user. Please check your input and try again.');
                        window.location.reload();
                    } finally {
                        // Re-enable the send button after the request
                        setIsSendEnabled(true); 
                    }
                } 
                       

        } else {
            await handleRegisterMessages();
            // Proceed only if we're at the last message of the registration process
            if (currentMsgIndex === registerMessages.length - 2) {
                const userData = {
                    username: registerMessages[0].senderMsg,
                    email: registerMessages[1].senderMsg,
                    phoneNumber: registerMessages[2].senderMsg,
                    dateOfBirth: registerMessages[3].senderMsg,
                    password: registerMessages[4].senderMsg,
                    confirm_password: registerMessages[5].senderMsg // Fixed the spelling
                };
    
                // Check if passwords match
                if (userData.password === userData.confirm_password) {
                    setInputMsg(''); // Clear previous messages
                    try {
                        // Disable the send button while waiting for the response
                        setIsSendEnabled(false); 
    
                        const response = await axios.post('http://localhost:5000/api/users/register', userData);
    
                        console.log('Response from server:', response.data); // Log server response for debugging
    
                        if (response.data.success) {
                            window.location.href = '/home'; // Redirect on successful registration
                        } else {
                            setInputMsg(response.data.message || "Registration failed. Please try again.");
                        }
                    } catch (error) {
                        console.error('Error registering user:', error); // Log error details
                        setInputMsg('Error registering user. Please check your input and try again.');
                    } finally {
                        // Re-enable the send button after the request
                        setIsSendEnabled(true); 
                    }
                } else {
                        alert("Password Not Matched");
                        window.location.reload();

                }
            }
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
                                        <p>{msg.timestamp}</p>
                                    </div>
                                </div>
                                {msg.senderMsg && msg.type === 'input' && (
                                    <div className='s-msg'>
                                        <div className='msg'>{msg.senderMsg}</div>
                                        <div>
                                            <img src={assets.BUser } alt="" />
                                            <p>{msg.timestamp}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {currentMessages[currentMsgIndex]?.type === 'input' && (
                        <form onSubmit={sendMsg}>
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
                                    type="submit"
                                    disabled={!isSendEnabled}
                                >
                                    <img src={assets.SendArrow} alt="Send" />
                                </button>
                            </div>
                        </form>


                    )}
                </div>
            </div>
        </div>
    );
}