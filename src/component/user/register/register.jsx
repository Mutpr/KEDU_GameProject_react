import { useState } from "react";
import axios from "axios";
function Register() {

    const Server_IP = process.env.REACT_APP_Server_IP;

    const [registerId, setRegisterId] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerUserName, setRegisterUserName] = useState('');
    const [registerUserTagId, setRegisterTagId] = useState('');

    const handleRegister = async () => {
        try {
            const request = await axios.post(`http://192.168.0.18:80/user/register`, {
                user_id: registerId,
                user_password: registerPassword,
                user_name:registerUserName,
                user_tag_id: registerUserTagId
            }).then(
                response=>{
                    console.log(response.data)
                }
            )
        } catch (error) {
            console.error('Register failed:', error);

        }
    };

    return (
        <fieldset>
            <legend>Register</legend>
            <input
                type="text"
                name="user_id"
                placeholder="input userId"
                value={registerId}
                onChange={e => setRegisterId(e.target.value)}
            /><br />
            <input
                type="password"
                name="user_password"
                placeholder="input password"
                value={registerPassword}
                onChange={e => setRegisterPassword(e.target.value)}
            /><br />
            <input
                type="text"
                name="user_name"
                placeholder="input username"
                value={registerUserName}
                onChange={e => setRegisterUserName(e.target.value)}
            /><br />
                        <input
                type="text"
                name="user_tag_id"
                placeholder="input tag id"
                value={registerUserTagId}
                onChange={e => setRegisterTagId(e.target.value)}
            /><br />
            <button onClick={handleRegister}>회원가입</button>
        </fieldset>
    );

}
export default Register;