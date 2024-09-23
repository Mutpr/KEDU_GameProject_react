import style from '../component/sidebar.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import Roomlist from './roomlist';
function Roomlist() {
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
    </Row>
  );
}

export default Roomlist;