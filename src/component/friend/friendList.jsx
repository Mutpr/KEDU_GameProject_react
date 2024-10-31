import { useEffect, useState } from "react";
import axios from "axios";
function FriendList({userSeq}){
    const [friendList, setFriendList] = useState([]);
    useEffect(() => {
        axios.get(`http://192.168.0.18:80/friend/${userSeq}`).then(
            (response) => {
                console.log(response.data)
                setFriendList(response.data);
            }
        )
    }, []);
}

export default FriendList;