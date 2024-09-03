import { useState, useRef, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../../WebSocketContext";

function Login() {
const [socketData, setSocketData] = useState('');
    const navigate = useNavigate(); // useNavigate를 함수의 최상위에서 호출
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // 로그인 상태 관리
    const [userName, setUserName] = useState('');  // 로그인한 사용자 이름 저장
    const {connectWebSocket} = useWebSocket();

    // 로그인 시도 처리
    const handleLogin = () => {
        const userInfo = {
            user_id: userId,
            user_password: userPassword
        };

        axios.post(`http://192.168.0.100:80/user`, userInfo)
        .then(response => {
            console.log('Login successful:', response.data);
            if (response.data.user_name) {
                setUserName(response.data.user_name);
                connectWebSocket('ws://192.168.0.100:80/socket/chat');
                setIsLoggedIn(true)
            }
        })
        .catch(error => {
            console.error('Login failed:', error);
        });
    }    

    // 사용자 ID 변경 처리
    const handleUserId = (e) => {
        setUserId(e.target.value);
    };

    // 사용자 비밀번호 변경 처리
    const handleUserPassword = (e) => {
        setUserPassword(e.target.value);
    };

    const handleMessenger = () => {
        navigate(`/messenger/${userName}`); // 이벤트 핸들러 내에서 navigate 사용
      };
    // 로그인 폼 또는 인사말을 조건부로 렌더링
    return (
        <div>
            {!isLoggedIn ? (
                <fieldset>
                    <legend>Login</legend>
                    <input 
                        name="user_id" 
                        placeholder="input userId" 
                        value={userId} 
                        onChange={handleUserId}
                    /><br/>
                    <input 
                        name="user_password" 
                        placeholder="input password" 
                        value={userPassword} 
                        onChange={handleUserPassword}
                    /><br/>
                    <button onClick={handleLogin}>로그인</button>
                </fieldset>
            ) : (
                <div>
                    <fieldset>
                        <legend>Menu</legend>
                        {userName}님 안녕하세요!<br></br>
                        <button onClick={handleMessenger}>메신저</button>
                    </fieldset>
                </div>
            )}
        </div>
    );
}

export default Login;
