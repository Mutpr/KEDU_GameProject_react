import { useEffect, useState, useCallback } from "react";

function GroupMessage({ userSeq, chatroomId }) {
    
    console.log("chatroomId:::: "+chatroomId)
    const [message, setMessage] = useState([]);
    const [roomId, setRoomId] = useState('');
    // const { sendMessage, messages = [], isConnected } = useWebSocket();
    const [msg, setMsg] = useState("");
    // const [message, setMessage] = useState([]);
    
    const fetchData = async () => {
        console.log(chatroomId)  // 현재 chatroomId 로깅
        const queryParams = new URLSearchParams({ roomId: chatroomId });
        const url = `http://192.168.1.238:9998/getGroupMessage?${queryParams}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');  // 네트워크 응답이 정상이 아닐 경우 예외 발생
            }
            const data = await response.json();  // 응답 데이터를 JSON으로 파싱
            setMessage(data);  // 상태 업데이트
            setRoomId(chatroomId);  // 현재 방 ID 설정
        } catch (error) {
            console.log(error, 'error occurred');  // 에러 로깅
        }
    }
    
    useEffect(() => {
        fetchData()
    }, [chatroomId])

    const handleMessage = useCallback(async (e) => {
        console.log("Current chatroomId:", chatroomId); // chatroomId 상태 로그
        const data = { 
            name: userSeq, 
            msg, 
            date: new Date().toString(), 
            receiver: 0, 
            roomId: '11f5bc47-e23e-4e09-a4c7-ec3c6b80991c' // 상태에서 직접 사용
        };
        console.log(data);
        try {
            // 데이터 전송 로직
            const response = await fetch('http://192.168.1.238:9998/insertGroupMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const jsonResponse = await response.json();
            setMessage(prevMessage => [...prevMessage, jsonResponse]); // jsonResponse를 메시지 배열에 추가
            setMsg(""); // 입력 필드 초기화
        } catch (error) {
            console.error("메시지 전송 오류:", error);
        }
    }, [msg, userSeq, chatroomId]); // 의존성 배열에 msg, userSeq, chatroomId 추가
    
    
    return (
        <div id="chat-wrap" className="d-flex flex-column m-5">
            <h1>WebSocket Chatting</h1>
            <div id='sendZone'>
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
                <button onClick={handleMessage} value={chatroomId}>Send</button>
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

export default GroupMessage;