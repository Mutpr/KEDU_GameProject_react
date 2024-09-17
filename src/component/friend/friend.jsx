import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import FriendRequest from "./friendRequest";
import FriendReceivedRequest from "./friendReceivedRequest";
import { DATA } from './MAIN_DATA';
import { Cookies } from "react-cookie";
import Swal from 'sweetalert2'

function Friend() {
    const navigate = useNavigate(); // useNavigate를 함수의 최상위에서 호출

    const [isFriendExist, setIsFriendExist] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userList, setUserList] = useState([]);
    const userSeq = useParams();
    const [content, setContent] = useState();


    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const [searchKeyword, setSearchKeyword] = useState('');

    const stringifiedSeq = JSON.stringify(userSeq);
    const parsedSeq = JSON.parse(stringifiedSeq).userSeq;

    const [requestResult, setRequestResult] = useState('');

    const selectComponent = {
        first: <FriendRequest />,
        second: <FriendReceivedRequest />
    }
    const handleSearch = () => {
        console.log(parsedSeq);
        axios.get('http://172.30.1.87:80/friend/userSearch', { params: { "searchKeyword": searchKeyword, "userSeq": parsedSeq } })
            .then((response) => {
                console.log(response.data)
                // 예를 들어 응답이 사용자 객체의 배열이라고 가정
                setUserList(response.data); // 배열 전체를 userList로 설정
            }).catch(error => {
                console.error("Search failed:", error);
            });
    }

    const handleFriendAdd = (e) => {
        // console.log(e.target.value)
        axios.post('http://172.30.1.87:80/friend/addFriend', { params: { "friend_request_owner_seq": parsedSeq, "friend_request_sender_seq": e.target.value } }).then(
            (response)=>{
                console.log(response.data);
                setRequestResult(response.data)
                if(response.data === '친구 요청을 전송하는데 성공했습니다'){
                    Swal.fire({
                        text: response.data,
                        icon: "success"
                      });
                }else if(response.data === '친구 요청을 전송하는데 실패했습니다.'){
                    Swal.fire({
                        icon: "error",
                        title: response.data,
                      });

                }else if(response.data === '이미 친구 요청을 보낸 유저입니다.'){
                    Swal.fire({
                        icon: "error",
                        title: response.data,
                      });
                }
            }
        )
    }

    const handleClickButton = (e) => {
        const { name } = e.target;
        setContent(name);
    };

    return (
        <fieldset>
            <h1>친구창</h1>

            {isFriendExist ? (
                <div>
                    <div>보낸 친구 요청 만들 부분</div>
                    <br></br>
                    <Button className="m-1" onClick={handleShow}>친구 추가</Button>
                </div>
            ) : (
                <div>
                    <Button className="m-1" onClick={handleShow}>친구 추가</Button>
                    {
                            DATA.map(data => (
                                <Button className="m-1" onClick={handleClickButton} name={data.name} key={data.id}>
                                    {data.text}
                                </Button>
                            ))
                    }
                    {selectComponent[content]}
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
                        <div className="m-2" key={user.id || idx}>
                            {user.user_name} ({user.user_tag_id})
                            <Button onClick={handleFriendAdd} value={user.user_seq}> 친구 추가 </Button>

                        </div>
                    ))}

                    {/* // <div className="m-2" key={user.id || idx}>
                        //     {user.user_name} ({user.user_tag_id})
                        //     <Button onClick={handleFriendAdd} value={user.user_seq}> 친구 추가 </Button>
                        // </div>
                    ))} */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>닫기</Button>
                </Modal.Footer>
            </Modal>
        </fieldset>
    );
}

export default Friend;
