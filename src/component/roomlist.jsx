import style from '../component/sidebar.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
// import Roomlist from './roomlist';
function Roomlist({userSeq}) {
  console.log("userSeq:: "+userSeq)
  const [roomList, setRoomList] = useState('');
  const [seq, setSeq] = useState('');
  useEffect(() => {
    console.log(userSeq)
    // userSeq 값이 유효한지 확인
    if (userSeq) {
      // 쿼리 파라미터 생성
      const queryParams = new URLSearchParams({"userSeq": userSeq}).toString();
      // URL 생성
      const url = `http://192.168.0.18:9999/getRoomList?${queryParams}`;
      
      // 비동기 요청 실행
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Error occurred');
          }
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      };
  
      fetchData();
    } else {
      console.error("userSeq is not valid:", userSeq);
    }
  }, [userSeq]); // useEffect의 의존성 배열에 userSeq 추가
  return (
    <Row className={style.messenger}>
      <div className='mt-3'>
      <InputGroup>
        <Form.Control
          type="text"
          name="user_password"
          placeholder="친구를 검색해주세요."
          //친구 검색 기능 구현
        />
         <Button><FontAwesomeIcon icon={faMagnifyingGlass} className={style.searchIcon}/></Button>
        </InputGroup>
        </div>
        <div>

        </div>
    </Row>
  );
}

export default Roomlist;