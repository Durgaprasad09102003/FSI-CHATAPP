import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddContact({  addContentListener,  }) {
  const [number, setNumber] = useState('');

  


  const addContactDB = async () => {
    const userId = localStorage.getItem('userId');

    try {
      // Send the number as an object in the request body
      const chatResponse = await axios.post(`http://localhost:5000/api/users/addContact`, { number });

      // Check if the response indicates success
      if (!chatResponse.data.success) {
        toast.error(chatResponse.data.message); // Show error toast
        return;
      }

      const chats = {
        receiverId: chatResponse.data.receiverId,
        message: "Hi...",
      };
      await axios.post(`http://localhost:5000/api/chats/messageData/${userId}`, chats);
      // Reset the input field after successful addition
      setNumber('');
      toast.success('Contact added successfully!');
      
      
      // Call the addContentListener after a slight delay
      setTimeout(() => {
        addContentListener();
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to add contact. Please try again.'); // Show error toast
    }
  };

  return (
    <div className='AddContent'>
      <ToastContainer /> {/* Add ToastContainer to your component */}
      <div className='addingcontactcontainer'>
        <div>
          <button onClick={addContentListener}></button>
          <h2>ADD CONTACT</h2>
        </div>
        <div className='insiderAddContact'>
          <input
            type='tel'
            id='phoneNumber'
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder='Enter Phone Number'
          />
          <button onClick={addContactDB}>ADD</button>
        </div>
      </div>
    </div>
  );
}
