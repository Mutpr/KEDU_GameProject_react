import React, { createContext, useState } from 'react';

export const ChatRoomContext = createContext({ chatRoomId: '11f5bc47-e23e-4e09-a4c7-ec3c6b80991c', setChatRoomId: () => {} });

export const ChatRoomProvider = ({ children }) => {
    const [chatRoomId, setChatRoomId] = useState(null);

    return (
        <ChatRoomContext.Provider value={{ chatRoomId, setChatRoomId }}>
            {children}
        </ChatRoomContext.Provider>
    );
};
