import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebSocket } from "../../WebSocketContext";

function Messenger({chatRoomId}) {
    console.log("chatroomId:: "+chatRoomId)
    const navigate = useNavigate();
    const { userSeq, roomId } = useParams();
    const { sendMessage, messages = [], isConnected } = useWebSocket();
    const [msg, setMsg] = useState("");
    const [message, setMessage] = useState([]);

    // useEffect(() => {
    //     if (!userSeq) {
    //         alert('로그인 해주세요.');
    //         navigate('/login');
    //     }
    // }, [userSeq, navigate]);

    const fetchData = async () => {
        const queryParams = new URLSearchParams({userName:userSeq, receiver:roomId}).toString();
        const url = `http://192.168.1.238:9999/getRoomMessage?${queryParams}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessage(data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [chatRoomId]);

    const handleMessage = useCallback(async () => {
        if (msg.trim() === '') return;
        const data = { name: userSeq, msg, date: new Date().toISOString(), receiver: roomId };
        try {
            const response = await fetch('http://192.168.1.238:9999/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonResponse = await response.json();
            setMessage(prevMessages => [...prevMessages, jsonResponse]);
            setMsg("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [msg, userSeq, roomId]);

    return (
        <div id="chat-wrap">
            <h1>WebSocket Chatting</h1>
            <div id='sendZone'>
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
                <button onClick={handleMessage}>Send</button>
            </div>
            <div id='talk'>
                {message.map((item, idx) => (
                    <div key={idx}>
                        <b>{item.name}</b> [ {item.date} ]: {item.msg}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Messenger;
