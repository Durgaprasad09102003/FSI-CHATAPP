import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Profile.css';
import assets from '../../assets/assets';

export default function Profile() {
    const [image, setImage] = useState(null); 
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [imageUrl, setImageUrl] = useState(null); 
    const [user, setUser] = useState({ username: '', avatar: '' });
    const avatarPath = `http://localhost:5000/public/uploads/${user.ProfileimageName}.jpg`;

    useEffect(() => {
        if (image) {
            const url = URL.createObjectURL(image);
            setImageUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [image]);   
    
    useEffect(() => {
        const fetchUserData = async () => {
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
        };

        fetchUserData();
    }, []);

    const profileUpdate = async () => {
        const userData = new FormData();
        userData.append('updateName', name || '');
        userData.append('updateBio', bio || '');
    
        if (image) {
            userData.append('avatar', image);
        }
    
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            await axios.put(`http://localhost:5000/api/users/profile/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success('Profile updated successfully!');
            setTimeout(() => {
                window.location.href = '/home';
            }, 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className='d-f fd-c jc-c ai-c ChatTheme'>
            <ToastContainer />
            <div className='d-f fd-c chat-box'>
                <div className='d-f fd-r ai-c jc-sb login-details'>
                    <div className='d-f fd-r ai-c login-details-bar'>
                        <img src={user.avatar ? avatarPath : assets.User} alt="Profile" />
                        <h1>{user.username}</h1>
                    </div>
                </div>
                <div className='Profile-Login-menu'>
                    <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImage(file);
                                console.log("Uploaded file:", file);
                            } else {
                                console.log("No file uploaded");
                            }
                        }}
                        name="profileUpdatePic"
                        id="profileUpdatePic"
                        hidden
                    />
                    <label htmlFor="profileUpdatePic">
                        <img 
                            id="preview" 
                            src={imageUrl || assets.BUser}
                            alt="Profile" 
                            style={{ cursor: 'pointer' }}
                        />
                    </label>

                    <input
                        type='text'
                        name="ProfileName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Update Profile Name'
                    />
                    <textarea
                        placeholder='Enter your bio'
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                    <button onClick={profileUpdate}>Save</button>
                </div>
            </div>
        </div>
    );
}