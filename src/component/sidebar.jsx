import style from '../component/sidebar.module.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import image1 from './image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import { Form } from 'react-bootstrap';
import person from '../component/person-icon-1682.png'
import axios from 'axios';
import { useEffect } from 'react';
import Roomlist from './roomlist';
import Messenger from './messenger/messengerList';
import GroupMessage from './messenger/groupMessenger';
import Login from './user/login/login';

function SideBar({ userSeq }) {
  console.log(userSeq);
  const [seq, setSeq] = useState('');
  const [show, setShow] = useState(false);
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [imgFile, setImgFile] = useState(null);
  const [chatRoom, setChatRoom] = useState([]);
  const [chatroom_title, setChatroom_title] = useState('');
  const [chatroom_desc, setChatroom_desc] = useState('');
  const [chatroom_user_list, setChatroom_user_list] = useState('');
  const [message, setMessage] = useState([]);
  const [chatroomId, setChatRoomId] = useState('');

  const imgRef = useRef();  // input element에 대한 참조를 저장
  const [insertParams, setInsertParams] = useState({
    chatroom_title: chatroom_title,
    chatroom_desc: chatroom_desc,
    chatroom_user_list: userSeq
  });

  useEffect(() => {
    
    setInsertParams({
      chatroom_title: chatroom_title,
      chatroom_desc: chatroom_desc,
      chatroom_user_list: userSeq
      // 추가 필드 업데이트
    });
  }, [chatroom_title, chatroom_desc]); // 의존성 배열에 필드를 추가


  useEffect(() => {
    setSeq(userSeq)
    axios.get(`http://192.168.1.238:80/chatroom`,{params:{userSeq: userSeq}})
      .then((response) => {
        console.log(response.data);  // 서버로부터 받은 데이터를 콘솔에 출력
        setChatRoom(response.data)
      })
      .catch((error) => {
        console.error('데이터 로딩 중 오류 발생:', error);
      });
  }, [userSeq]);  // user_seq가 변경될 때마다 이 effect를 다시 실행

  // 이미지 파일을 선택하면 호출되는 함수
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  const handleTitle = (e) => {
    setChatroom_title(e.target.value); // 상태 업데이트
  };

  const handleDesc = (e) => {
    setChatroom_desc(e.target.value)
  }
  const handleChatRoomInsert = () => {
    console.log("눌림");
    axios.post('http://192.168.1.238:80/chatroom', insertParams, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('채팅방 생성 성공:', response.data);
      })
      .catch(error => {
        console.error('채팅방 생성 오류:', error);
      });
  };

  const handleChatRoom = (e) => {
    const chatroomId = e.target.getAttribute('data-chatroom-id');
    console.log(chatroomId);
    setChatRoomId(chatroomId);
  }
  return (
    <>
      <Row className={style.sidebar}>
        <Col className="d-flex w-100 p-1">
          <div className={style.logo}>
            <img src={image1} className={style.image1}></img>
            {/**이부분에 main href 걸기 */}
          </div>
        </Col>
        {chatRoom.map((item, idx) => (
          <div key={idx} className={style.roomList}>
            <div className={style.roomLogo} onClick={handleChatRoom} data-chatroom-id={item.chatroom_id}>
              {item.chatroom_title}
            </div>
          </div>
        ))}
        <div className={style.roomList}>
          <div className={style.roomLogo} onClick={handleShow}><FontAwesomeIcon className={style.roomListPlusIcon} icon={faPlus} /></div>
        </div>
      </Row>
      <Roomlist userSeq={userSeq}/>
      {chatroomId && <Login userSeq={userSeq} chatroomId={chatroomId}/>}
      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}
      {/* <Messenger /> */}
      <Modal show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>채팅방 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex col">
            <div className="d-flex justify-content-center align-items-center flex-column">
              <img
                src={imgFile ? imgFile : person}  // imgFile 상태가 있으면 사용, 없으면 기본 이미지
                alt="프로필 이미지"
                style={{ width: '100px', height: '100px' }}  // 이미지 사이즈 조절
              />
              <form>
                <label className={style.signupProfileImgLabel} htmlFor="profileImg">프로필 이미지 추가</label>
                <input
                  className="signup-profileImg-input"
                  type="file"
                  accept="image/*"
                  id="profileImg"
                  onChange={saveImgFile}
                  ref={imgRef}

                />
              </form>
            </div>
            <div className='d-flex m-3 mt-1 flex-column w-100'>
              <h5 className='mb-1'>채팅방 명</h5>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="채팅방 명"
                  aria-label="chat_room_title"
                  aria-describedby="basic-addon1"
                  value={chatroom_title}
                  onChange={handleTitle}
                />
              </InputGroup>
              <h5 className='mb-1'>채팅방 설명</h5>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="채팅방 설명"
                  aria-label="chat_room_desc"
                  aria-describedby="basic-addon1"
                  value={chatroom_desc}
                  onChange={handleDesc}
                />
              </InputGroup>

            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChatRoomInsert}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SideBar;