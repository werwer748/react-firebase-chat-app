import React from 'react'
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';
import ChatRoomClass from './ChatRoomClass';

function SidePanel() {
  return (
    <div 
        style={{
            backgroundColor: "#7b83eb",
            padding: '2rem',
            minHeight: '100vh',
            color: 'white',
            minWidth: '275px'
        }}
    >
        <UserPanel />
        <Favorited />
        <ChatRooms />
        {/* <ChatRoomClass /> */}
        <DirectMessages />
    </div>
  )
}

export default SidePanel;