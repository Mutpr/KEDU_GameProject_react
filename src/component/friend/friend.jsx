import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

function Friend() {
    const [isFriendExist, setIsFriendExist] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userList, setUserList] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const [searchKeyword, setSearchKeyword] = useState('');

    const handleSearch = () => {
        axios.get('http://192.168.1.238:80/friend/userSearch', { params: { "searchKeyword": searchKeyword } })
        .then((response) => {
            console.log(response.data)
            // 예를 들어 응답이 사용자 객체의 배열이라고 가정
            setUserList(response.data); // 배열 전체를 userList로 설정
        }).catch(error => {
            console.error("Search failed:", error);
        });
    }

    const handleFriendAdd=(e)=>{
       axios.post('http://192.168.1.238:80/friend/addFriend', {params:{"userSeq":e.target.value}})
    }
    return (
        <fieldset>
            <legend>친구창</legend>
            {isFriendExist ? (
                <div>친구 리스트 만들 부분</div>
            ) : (
                <div>
                    추가된 친구가 없습니다.
                    <button onClick={handleShow}>친구 추가</button>
                </div>
            )}
            <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>친구 검색</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup size="lg">
                        <Form.Control
                            aria-label="Large"
                            aria-describedby="inputGroup-sizing-sm"
                            placeholder="찾을 유저의 태그 아이디를 입력하세요."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleSearch}>검색</Button>
                    </InputGroup>
                    {userList.map((user, idx) => (
                        <div className="m-2"key={user.id || idx}>
                            {user.user_name} ({user.user_tag_id})
                            <Button onClick={handleFriendAdd} value={user.user_seq}> 친구 추가 </Button>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>닫기</Button>
                </Modal.Footer>
            </Modal>
        </fieldset>
    );
}

export default Friend;
