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


function SideBar() {
  const [show, setShow] = useState(false);
  const [uploadImgUrl, setUploadImgUrl] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [imgFile, setImgFile] = useState(null);
  const imgRef = useRef();  // input element에 대한 참조를 저장

  // 이미지 파일을 선택하면 호출되는 함수
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);  // 파일을 읽어서 데이터 URL로 변환
      reader.onloadend = () => {
        setImgFile(reader.result);  // 데이터 URL을 imgFile 상태로 저장
      };
    } else {
      // 선택된 파일이 이미지가 아니면 경고 메시지를 표시
      alert("이미지 파일이 아닙니다.");
      setImgFile(null);  // 이전 이미지 상태를 제거
    }
  };
  return (
    <>
      <Row className={style.sidebar}>
        <Col className="d-flex w-100 p-1">
          <div className={style.logo}>
            <img src={image1} className={style.image1}></img>
            {/**이부분에 main href 걸기 */}
          </div>
        </Col>
        {/* 방 목록 구현할 부분 */}
        <div className={style.roomList}>
          <div className={style.roomLogo} onClick={handleShow}><FontAwesomeIcon className={style.roomListPlusIcon} icon={faPlus} /></div>
        </div>
      </Row>

      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>채팅방 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input
              type="file"
              accept="image/*"
              id="profileImg"
              onChange={saveImgFile}
              ref={imgRef}
            />
            <img
              src={imgFile ? imgFile : `./image.png`}  // imgFile 상태가 있으면 사용, 없으면 기본 이미지
              alt="프로필 이미지"
              style={{ width: '150px', height: '150px' }}  // 이미지 사이즈 조절
            />

            <h5>채팅방 명</h5>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="채팅방 명"
                aria-label="chat_room_title"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SideBar;