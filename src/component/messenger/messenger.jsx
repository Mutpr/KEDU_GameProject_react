// Messenger.jsx
import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebSocket } from "../../WebSocketContext";

function Messenger() {
    const navigate = useNavigate();
    const { userName } = useParams();
    const { sendMessage, messages, isConnected } = useWebSocket();
    const [msg, setMsg] = useState("");

    // Redirect if not logged in
    if (!userName) {
        alert('로그인 해주세요.');
        navigate('/');
    }

    const handleSend = useCallback(() => {
        if (msg !== '') {
            const data = {
                name: userName,
                msg,
                date: new Date().toLocaleString()
            };
            sendMessage(JSON.stringify(data));  // Use context method to send message
            setMsg("");  // Clear message input after sending
        }
    }, [msg, sendMessage, userName]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div id="chat-wrap">
            <div id='chatt'>
                <h1 id="title">WebSocket Chatting</h1>
                <div id='talk'>
                    {messages.map((item, idx) => (
                        <div key={idx} className={item.name === userName ? 'me' : 'other'}>
                            <span><b>{item.name}</b></span> [ {item.date} ]<br />
                            <span>{item.msg}</span>
                        </div>
                    ))}
                </div>
                <h3>{userName}</h3>
                <div id='sendZone'>
                    <textarea id='msg' value={msg} onChange={(e) => setMsg(e.target.value)}
                        onKeyDown={handleKeyDown}></textarea>
                    <input type='button' value='전송' id='btnSend' onClick={handleSend} />
                </div>
            </div>
        </div>
    );
}

export default Messenger;
