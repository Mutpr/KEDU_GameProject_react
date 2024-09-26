import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import style from "../../sidebar.module.css"
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import SideBar from "../../sidebar";
import Friend from "../../friend/friend";
import Messenger from "../../messenger/messengerList"
import GroupMessage from "../../messenger/groupMessenger";

function Login({chatroomId}) {
    const [showFriend, setShowFriend] = useState(false); // Friend 컴포넌트의 렌더링 여부를 제어할 상태
    const [showMessage, setShowMessage] = useState(true);
    // const Server_IP = process.env.REACT_APP_Server_IP;
    const navigate = useNavigate(); // useNavigate를 함수의 최상위에서 호출

    const [userData, setUserData] = useState([]);
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [userSeq, setUserSeq] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const handleMessenger = (e) => {
        console.log("isLoggedIn::::: ", isLoggedIn)
        console.log("userID::::: " + userId)
        console.log(e.target.value)
        if (isLoggedIn && userId) {
            navigate(`/messenger/${e.target.value}`);
        }
    }

    const handleFriend = (e) => {
        console.log("isLoggedIn::::: ", isLoggedIn)
        console.log("userSeq::::: " + userSeq)
        console.log(e.target.value)
        if (isLoggedIn && userSeq) {
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
            const request = await axios.post(`http://192.168.1.238:80/user/login`, { user_id: userId, user_password: userPassword })
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

    const handleRegister = () => {
        navigate('/register')
    }

    return (
        <div className={style.main}>
            {!isLoggedIn && !sessionStorage.getItem('login') ? (
                <div className={style.login}>
                    <fieldset>
                        <legend>Login</legend>
                        <InputGroup>
                            <Form.Control
                                className="mb-1 mt-0"
                                type="text"
                                name="user_id"
                                placeholder="input userId"
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                            /></InputGroup>
                        <InputGroup>
                            <Form.Control
                                type="password"
                                name="user_password"
                                placeholder="input password"
                                value={userPassword}
                                onChange={e => setUserPassword(e.target.value)}
                            /></InputGroup>
                        <Button className="m-1 ml-0" onClick={handleLogin}>로그인</Button>
                        <Button variant="secondary" onClick={handleRegister}>회원가입</Button>
                    </fieldset>
                </div>
            ) : (
                <div>
                    <SideBar userSeq={userSeq}/>
                    <div className={style.mainSection}>
                        <div className={style.cardSection}>
                    <Card className={style.mainCard}>
                        <Button variant="secondary"className="m-2" onClick={() => setShowFriend(!showFriend)} value={userSeq}
                            >친구</Button>
                    </Card>
                    </div>
                    <div  className="h-100">
                    {showFriend && <Friend userSeq={userSeq} />}
                    {showMessage && <GroupMessage userSeq={userSeq} chatroomId={chatroomId}/>}
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
