import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css"
import Calendar from "react-calendar"

import style from "../../sidebar.module.css"
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import SideBar from "../../sidebar";
import Friend from "../../friend/friend";
import Messenger from "../../messenger/messengerList"
import GroupMessage from "../../messenger/groupMessenger";
import Modal from 'react-bootstrap/Modal';

function Login({ chatroomId }) {
    const [calendarShow, setCalendarShow] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false); // 두 번째 모달 상태

    const handleSecondModalOpen = () => setShowSecondModal(true);
    const handleSecondModalClose = () => setShowSecondModal(false);

    const handleCalendarClose = () => setCalendarShow(false);
    const handleCalendarShow = () => setCalendarShow(true);
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
    const [value, onChange] = useState(new Date())


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
            const request = await axios.post(`http://192.168.0.18:80/user/login`, { user_id: userId, user_password: userPassword })
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
        <>
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
                    <SideBar userSeq={userSeq} />
                    <div className={style.mainSection}>
                        <div className={style.cardSection}>
                            <Card className={style.mainCard}>
                                <Button variant="secondary" className="m-1" onClick={() => setShowFriend(!showFriend)} value={userSeq}
                                >친구</Button>
                                <Button variant="secondary" className="m-1" onClick={handleCalendarShow}
                                >이벤트</Button>
                            </Card>
                        </div>
                        <div id="talk" className="h-100 w-100 d-flex flex-column-reverse">
                            {showFriend && <Friend userSeq={userSeq} /> || showMessage && <GroupMessage userSeq={userSeq} chatroomId={chatroomId} />}

                        </div>
                    </div>
                </div>
            )}
        </div>
        <Modal
        show={calendarShow}
        onHide={handleCalendarClose}
        backdrop="static"
        keyboard={false}
        centered
        style={showSecondModal ? { filter: 'blur(5px)' } : {}} 
      >
        <Modal.Header closeButton>
          <Modal.Title>이벤트 캘린더</Modal.Title>
          <Button className="m-3 mt-1 mb-1" onClick={handleSecondModalOpen}> 이벤트 추가</Button>
        </Modal.Header>
        <Modal.Body className={style.CalendarModal}>
        
         <Calendar onChange={onChange} value={value}></Calendar>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCalendarClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>

            {/* 두 번째 모달 */}
            <Modal size="lg" backdrop="static" centered show={showSecondModal} onHide={handleSecondModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>이벤트 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSecondModalClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    );
}

export default Login;
