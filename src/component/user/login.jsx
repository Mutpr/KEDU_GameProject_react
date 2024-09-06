import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UseWebSocket } from "../../WebSocketContext"

function Login() {
    const navigate = useNavigate(); // useNavigate를 함수의 최상위에서 호출

    const [userData, setUserData] = useState([]);
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState(''); 
    const [userSeq, setUserSeq] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleMessenger =(e) => {
        console.log("isLoggedIn::::: ",isLoggedIn)
        console.log("userID::::: "+userId)
        if(isLoggedIn && userId){
            navigate(`/messenger/${e.target.value}`);
        }
    }

    const handleFriend =(e) =>{
        console.log("isLoggedIn::::: ",isLoggedIn)
        console.log("userID::::: "+userId)
        if(isLoggedIn && userId){
            navigate(`/friend/${e.target.value}`)
        }
    }

    useEffect(() => {
        const storedData = sessionStorage.getItem('login');
        if (storedData) {
            const data = JSON.parse(storedData);
            setUserData(data);
            setUserId(data.user_id);
            setIsLoggedIn(true)
        }
    }, []);

    const handleLogin = async () => {
        try {
            const request = await axios.post(`http://192.168.1.238:80/user`, { user_id: userId, user_password: userPassword })
                .then(response => {
                    setIsLoggedIn(true); // 로그인 성공 상태 업데이트
                    sessionStorage.setItem('login', JSON.stringify(response.data))
                    console.log('Login successful:', response.data);
                    setUsername(userData.user_name)
                    setUserSeq(userData.user_seq)
                });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            {!isLoggedIn && !sessionStorage.getItem('login') ? (
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
                <div>
                    <fieldset>
                        <legend>Menu</legend>
                        {userData.user_name}님 안녕하세요!<br></br>
                        <button onClick={handleMessenger} value={userId}>메신저</button>
                        <button onClick={handleFriend} value={userId}>친구</button>
                    </fieldset>
                </div>
            )}
        </div>
    );
}

export default Login;
