// WebSocketContext.js
import { createContext, useContext, useState, useEffect, useRef } from "react";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket('ws://192.168.1.238:80/socket/chat');

        socketRef.current.onopen = () => {
            setIsConnected(true);
            console.log("WebSocket is opened");
        };

        socketRef.current.onmessage = (event) => {
            const newMessage = event.data
            console.log(newMessage)
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };

        socketRef.current.onerror = error => {
            console.error("WebSocket Error:", error);
        };

        socketRef.current.onclose = () => {
            setIsConnected(false);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log(message)
        } else {
            console.error("WebSocket is not connected.");
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage, messages, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};