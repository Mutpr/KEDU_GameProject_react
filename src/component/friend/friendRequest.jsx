import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function FriendRequest() {
    const userSeq = useParams();
    const stringifiedSeq = JSON.stringify(userSeq);
    const parsedSeq = JSON.parse(stringifiedSeq).userSeq;
    const [requestList, setRequestList] = useState([]);


    useEffect(() => {
        axios.get('http://172.30.1.87:80/friend/findRequest', { params: { "user_seq": parsedSeq } }).then(
            (response) => {
                setRequestList(response.data);
            }
        )


    }, []);


    return (
        <div>
            {/* {requestList === '' ? <h1>보낸 친구 요청이 없습니다.</h1> :
                <h1 id="title">보낸 친구 요청</h1>
            {requestList.map((item, idx) => (
                        {item.user_tag_id}
                ))
            }
            } */}
            <h4 id="title">보낸 친구 요청</h4>
            {
                requestList === '' ?
                    <h1>보낸 친구 요청이 없습니다.</h1> :
                    (
                        //카드형으로 대체
                        <>
                            {requestList.map((item, idx) => (
                                <div key={idx}><h5>{item.user_name}</h5>
                                <h6> &nbsp; &nbsp; # &nbsp; {item.user_tag_id}</h6></div>
                            ))}
                        </>
                    )
            }

        </div>
    );
}

export default FriendRequest;