import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebSocket, WebSocketProvider } from "../../WebSocketContext";

function Messenger() {
    const navigate = useNavigate();
    const { userSeq } = useParams();
    const { roomId } = useParams();
    const { sendMessage, messages = [], isConnected } = useWebSocket();
    const [msg, setMsg] = useState("");
    const messageInputRef = useRef(null);
    // const [message, setMessage] = useState([]);
    const [updatedMessages, setUpdatedMessages] = useState('');
    const [id, setId] = useState('');
    const [message, setMessage] = useState([]); // 메시지 목록 상태`
    // 로그인 되어 있지 않은 경우 메인 페이지로 리다이렉트
    // useEffect(() => {
    //     if (!userName) {
    //         alert('로그인 해주세요.');
    //         navigate('/');
    //     }
    // }, [userName, navigate]);

    const fetchData = async () => {
        const queryParams = new URLSearchParams({ name: userSeq, receiver: roomId }).toString();
        const url = `http://172.30.1.15:9999/getMessage?${queryParams}`; // Adjusted for a hypothetical endpoint that accepts query parameters

        try {
            const response = await fetch(url);  // Only URL needed for GET request
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data); // Handle the data however you need
            setMessage(data);
        } catch (error) {
            console.error('Failed to fetch:', error); // Error handling
        }
    };
    useEffect(() => {
        if (!userSeq) {
            alert('로그인 해주세요.');
            navigate('/');
        } else {
            
            fetchData();
            // fetchAndUpdateMessages();
        }

    }, [userSeq, roomId]); // Dependencies array to control the effect's re-execution



    const handleMessage = useCallback(async (e) => {
        if (e) e.preventDefault(); // Prevent the default form submission behavior

        if (msg.trim() !== '') { // Check if the message isn't just empty spaces
            try {
                const data = { name: userSeq, msg, date: new Date().toLocaleString(), receiver: roomId };
                console.log("Sending data:", data); // Correctly log the object

                const response = await fetch('http://172.30.1.15:9999/message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    const jsonResponse = await response.json(); // Parse JSON response
                    console.log("Response from server:", jsonResponse); // Log the parsed JSON response
                    setMessage(prevMessages => [...prevMessages, jsonResponse])
                    setMsg("");
                }
            } catch (error) {
                console.error("Failed to send message:", error); // Log any errors that occur during the fetch
            }
        }

    }, [msg, sendMessage, userSeq, roomId]);


    const [editingId, setEditingId] = useState(null); // 현재 편집 중인 메시지 ID
    const [editText, setEditText] = useState(''); // 편집 중인 텍스트

    // 메시지 목록 로드 함수(예시)
    // useEffect(() => {
    //     loadMessages();
    // }, []);

    // 수정 버튼 핸들러
    const handleUpdateClick = (item) => {
        setEditingId(item._id);
        setEditText(item.msg);
    };

    // 메시지 텍스트 변경 핸들러
    const handleTextChange = (event) => {
        setEditText(event.target.value);
    };


    const handleCancel = (originalMessage) => {
        setEditingId(null);
        setEditText(originalMessage);
    };
    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter' && !e.shiftKey) {
    //         e.preventDefault(); // Shift + Enter가 아닌 경우 기본 이벤트 방지
    //         handleSend();
    //     }
    // };

    // 수정 완료(저장) 핸들러
    const handleSave = async (id) => {
        try {
            const response = await fetch(`http://172.30.1.15:9999/updateMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, newMessage: editText })
            });
            if (!response.ok) {
                throw new Error('Failed to update message');
            }
    
            const updatedData = await response.json(); // 업데이트된 데이터를 받음
            setMessage(prevMessages => prevMessages.map(msg =>
                msg._id === id ? { ...msg, msg: updatedData.msg } : msg
            ));
            setEditingId(null);
            setEditText('');
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const handleDelete = async (messageToDelete) => {
        console.log("Deleting message:", messageToDelete);
        try {
            const response = await fetch('http://172.30.1.15:9999/deleteMessage', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: messageToDelete._id })  // Assuming you pass the ID directly for clarity
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete message');
            }
    
            const responseData = await response.json();
            if (responseData.success) {
                setMessage(prevMessages => prevMessages.filter(msg => msg._id !== messageToDelete._id));
            } else {
                console.error('Failed to delete the message:', responseData.message);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            alert('Failed to delete the message.');
        }
    };
    
    return (
        <div id="chat-wrap">
            <div id='chatt'>
                <h1 id="title">WebSocket Chatting</h1>
                <h3>{userSeq}</h3>
                <div id='sendZone'>
                    <textarea id='msg' value={msg} onChange={(e) => setMsg(e.target.value)}
                        ref={messageInputRef}></textarea>
                    <input type='button' value='전송' id='btnSend' onClick={handleMessage} />
                </div>
                <div id='talk'>
                    {message.map((item, idx) => (
                        <div key={item._id || idx}>
                            <b>{item.name}</b> [ {item.date} ]
                            {editingId === item._id ? (
                                <>
                                    <br></br>
                                    <input type="text" value={editText} onChange={handleTextChange} />
                                    <button onClick={() => handleSave(item._id)}>저장</button>
                                    <button onClick={() => handleCancel(item.msg)}>취소</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleUpdateClick(item)}>수정</button>
                                    <button onClick={() => handleDelete(item)}>삭제</button>
                                    <br />
                                    <span>{item.msg}</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Messenger;
