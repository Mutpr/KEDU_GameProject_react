import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebSocket, WebSocketProvider } from "../../WebSocketContext";

function Messenger() {
    const navigate = useNavigate();
    const { userName } = useParams();
    const { sendMessage, messages = [], isConnected } = useWebSocket();
    const [msg, setMsg] = useState("");
    const messageInputRef = useRef(null);

    // 로그인 되어 있지 않은 경우 메인 페이지로 리다이렉트
    useEffect(() => {
        if (!userName) {
            alert('로그인 해주세요.');
            navigate('/');
        }
    }, [userName, navigate]);

    const handleMessage = useCallback(async (e) => {
        if (e) e.preventDefault();
        if (msg.trim() !== '') {
            try {
                const data = { name: userName, msg, date: new Date().toLocaleString() };
                console.log("data:::: " + data)
                const response = await fetch('/message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                console.log(response)
                // sendMessage(JSON.stringify(data));
                // setMsg("");
                // messageInputRef.current.focus();
                if (!response.ok) throw new Error('failed to send message');
                setMsg("");
                messageInputRef.current.focus();
            } catch (error) {
                console.error("Failed to send message:", error);
            }

        }
    }, [msg, sendMessage, userName]);


    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter' && !e.shiftKey) {
    //         e.preventDefault(); // Shift + Enter가 아닌 경우 기본 이벤트 방지
    //         handleSend();
    //     }
    // };

    return (
        <div id="chat-wrap">
            <div id='chatt'>
                <h1 id="title">WebSocket Chatting</h1>
                <h3>{userName}</h3>
                <div id='sendZone'>
                    <textarea id='msg' value={msg} onChange={(e) => setMsg(e.target.value)}
                        ref={messageInputRef}></textarea>
                    <input type='button' value='전송' id='btnSend' onClick={handleMessage} />
                </div>
                <div id='talk'>
                    {messages.map((item, idx) => (
                        <div key={item.id || idx}>  {/* 고유 ID가 없으면 인덱스 사용 */}
                            <b>{item.name}</b> [ {item.date} ]<br />
                            <span>{item.msg}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Messenger;
