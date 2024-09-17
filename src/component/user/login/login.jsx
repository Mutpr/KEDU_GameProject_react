import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UseWebSocket } from "../../../WebSocketContext"

function Login() {

    const Server_IP = process.env.REACT_APP_Server_IP;
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
        console.log(e.target.value)
        if(isLoggedIn && userId){
            navigate(`/messengerList/${e.target.value}`);
        }
    }

    const handleFriend =(e) =>{
        console.log("isLoggedIn::::: ",isLoggedIn)
        console.log("userSeq::::: "+userSeq)
        console.log(e.target.value)
        if(isLoggedIn && userSeq){
            navigate(`/friend/${e.target.value}`)
        }
    }

    useEffect(() => {
        const storedData = sessionStorage.getItem('login');
        if (storedData) {
            const data = JSON.parse(storedData);
            console.log(data)
            setUserData(data);
            setUserId(data.user_id);
            setUserSeq(data.user_seq);
            setIsLoggedIn(true)
            console.log(data.user_seq)
        }
    }, []);
    const handleLogin = async () => {
        try {
            const request = await axios.post(`http://172.30.1.87:80/user/login`, { user_id: userId, user_password: userPassword })
                .then(response => {
                    setIsLoggedIn(true); // 로그인 성공 상태 업데이트
                    sessionStorage.setItem('login', JSON.stringify(response.data))
                    console.log('Login successful:', response.data);
                    setUsername(response.data.user_name)
                    setUserSeq(response.data.user_seq)
                    console.log(userData)
                });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleRegister=()=>{
        navigate('/register')
    }
    
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
                    <button onClick={handleRegister}>회원가입</button>
                </fieldset>
            ) : (
                <div>
                    <fieldset>
                        <legend>Menu</legend>
                        {userData.user_name}님 안녕하세요!<br></br>
                        <button onClick={handleMessenger} value={userSeq}>메신저</button>
                        <button onClick={handleFriend} value={userSeq}>칭긔!</button>
                    </fieldset>
                </div>
            )}
        </div>
    );
}

export default Login;
