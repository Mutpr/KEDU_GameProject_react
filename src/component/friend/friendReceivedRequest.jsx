import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "bootstrap";

function FriendReceivedRequest({userSeq}) {
    // URL 파라미터에서 userSeq 값을 추출합니다.
    // const userSeq = useParams();
    // const stringifiedSeq = JSON.stringify(userSeq);
    // const parsedSeq = JSON.parse(stringifiedSeq).userSeq;

    // 받은 친구 요청 목록을 저장할 상태 변수입니다.
    const [receivedRequestList, setReceivedRequestList] = useState([]);
    const [receivedRequestInfo, setReceivedRequestInfo] = useState([]);

    // 컴포넌트가 마운트될 때 받은 요청 목록을 서버로부터 가져옵니다.
    useEffect(() => {
        axios.get('http://192.168.1.238:80/friend/findReceivedRequest', { params: { "user_seq": userSeq } })
            .then(
                (response) => {
                    console.log(response)
                    setReceivedRequestList(response.data);
                }
            )
    }, []);

    const handleRequestAgree=(e)=>{
        console.log(e.target.value);
    }

    const handleRequestDisagree=(e)=>{
        console.log(e.target.value);
        axios.post('http://192.168.1.238:80/friend/requestDisagree',  {params:{"owner_seq":e.target.value,"user_seq":userSeq}})
    }
    return (
        <div >
            {/* 페이지 타이틀 */}
            <h4 id="title">받은 친구 요청</h4>
            {/* 받은 요청 목록을 출력합니다. 요청이 없으면 안내 메시지를 표시합니다. */}
            {
                receivedRequestList.length === 0 ?
                    <h5>받은 친구 요청이 없습니다.</h5> :
                    (
                        <>
                            {receivedRequestList.map((item, idx) => (
                                <>
                                <div key={idx} >{item.user_tag_id}</div>
                                <button value={item.user_seq} onClick={handleRequestAgree}>o</button>
                                <button value={item.user_seq} onClick={handleRequestDisagree}>x</button>
                                </>
                            ))}
                        </>
                    )
            }
        </div>
    );
}

export default FriendReceivedRequest;
