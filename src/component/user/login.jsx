import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {UseWebSocket} from "../../WebSocketContext"

function Login() {
    const navigate = useNavigate(); // useNavigate를 함수의 최상위에서 호출
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 로그인 후 메신저 페이지로 이동
        if (isLoggedIn) {
            navigate(`/messenger/${userId}`);
        }
    }, [isLoggedIn, navigate, userId]);

    const handleLogin = async () => {
        try {
            const request = await axios.post(`http://192.168.1.238:80/user`, { user_id: userId, user_password: userPassword })
                .then(response=>{
                    setIsLoggedIn(true); // 로그인 성공 상태 업데이트
                    sessionStorage.setItem('login', JSON.stringify(response.data))
                    console.log('Login successful:', response.data);
                });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            {!isLoggedIn ? (
                <fieldset>
                    <legend>Login</legend>
                    <input
                        type="text"
                        name="user_id"
                        placeholder="input userId"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                    /><br />
                    <input
                        type="password"
                        name="user_password"
                        placeholder="input password"
                        value={userPassword}
                        onChange={e => setUserPassword(e.target.value)}
                    /><br />
                    <button onClick={handleLogin}>로그인</button>
                </fieldset>
            ) : (
                <div>로그인 성공!</div>
            )}
        </div>
    );
}

export default Login;
