import React from 'react';
import assets from '../assets/assets';

export default function MainChatContent() {
  return (
    <div className="d-f fd-c ai-c MainChatContent">
      <div className="mainContentBody">
        <div className="MainBodyChat">
          <div className='chatHeaderDetails'>
            <div className='d-f fd-r ai-c jc-c'>
              <img src={assets.BUser} alt="" />
              <h2>DURGA PRASAD</h2>
            </div>
            <img src={assets.moreWide} alt="" />
          </div>
          <div className='SenderReceiverBody'>

          </div>
        </div>
        
        <div  className="d-f fd-r ai-c jc-c DataInputBox">

          <input type="text" placeholder="Type your message here..." />
          <input type='file' id="image" accept="image/png, image/jpeg image/jpg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" />
          </label>
          <button>
            <img src={assets.SendArrow} alt="" />
          </button>
        </div>
      </div>
    </div>
  )
}
