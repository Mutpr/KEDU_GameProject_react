import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebSocket } from "../../WebSocketContext";

function Messenger() {
    const navigate = useNavigate();
    const { userName } = useParams();
    const { sendMessage } = useWebSocket(); // Provider 인자 제거

    const [message, setMessage] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!userName) {
            alert('로그인 해주세요.');
            navigate('/');
        }
    }, [userName, navigate]);  // Dependency 추가

    const handleSend = useCallback(() => {
        if (msg.trim() !== '') {  // 사용자 입력이 비어있지 않은 경우만 처리
            const data = {
                name: userName,
                message: msg,
                date: new Date().toLocaleString()
            };
            sendMessage(JSON.stringify(data));  // 메시지 전송
            console.log("Sent data:", data);  // 콘솔 로그 간소화
            setMessage(prevMessages => [...prevMessages, data]);  // 메시지 배열 업데이트
            setMsg("");  // 입력 필드 초기화
        }
    }, [msg, userName, setMessage, sendMessage]); // 의존성 배열에 sendMessage 추가

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div id="chat-wrap">
            <div id='chatt'>
                <h1 id="title">WebSocket Chatting</h1>
                <div id='talk'>
                    {message.map((item, idx) => (
                        <div key={idx} className={item.name === userName ? 'me' : 'other'}>
                            <span><b>{item.name}</b></span> [ {item.date} ]<br />
                            <span>{item.message}</span>
                        </div>
                    ))}
                </div>
                <h3>{userName}</h3>
                <div id='sendZone'>
                    <textarea
                        id='msg'
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        onKeyDown={handleKeyDown}
                    ></textarea>

                    <button type='button' id='btnSend' onClick={handleSend}>전송</button>
                </div>
            </div>
        </div>
    );
}

export default Messenger;
