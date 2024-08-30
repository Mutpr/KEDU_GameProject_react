import React, { createContext, useContext, useRef, useState } from 'react';

const WebSocketContext = createContext({
  connectWebSocket: () => {} // Provide a default implementation
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [status, setStatus] = useState('disconnected');
    const [error, setError] = useState('');
    const ws = useRef(null);

    const connectWebSocket = (url) => {
        console.log("url:: "+url);
        // Close any existing connection
        if (ws.current) {
            ws.current.close();
        }
        ws.current = new WebSocket(url);
        ws.current.onopen = () => {
            console.log("WebSocket connection established");
            setStatus('connected');
            setError(''); // Clear any previous errors on successful connection
        };
        ws.current.onmessage = (event) => {
            console.log("Message from server:", event.data);
        };
        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
            setStatus('disconnected');
        };
        ws.current.onerror = (errorEvent) => {
            console.error("WebSocket error:", errorEvent);
            setError('WebSocket connection error');
            setStatus('error');
        };
    };

    return (
        <WebSocketContext.Provider value={{ connectWebSocket }}>
            {children}
        </WebSocketContext.Provider>
    );
};
