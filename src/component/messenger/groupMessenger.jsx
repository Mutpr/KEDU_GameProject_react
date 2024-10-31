import { useEffect, useState, useCallback, useRef } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import style from '../messenger/messenger.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";

function GroupMessage({ userSeq, chatroomId }) {
    console.log(chatroomId)

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [previewContent, setPreviewContent] = useState('');
    const [msg, setMsg] = useState("");
    const [uploadStatus, setUploadStatus] = useState(''); // 업로드 상태 메시지

    const fileInputRef = useRef(null);

    // 서버에서 그룹 메시지를 가져오는 함수
    const fetchMessage = async () => {
        // roomId를 바로 queryParams에 사용
        const queryParams = new URLSearchParams({ roomId: chatroomId });
        const url = `http://192.168.0.18:9998/getGroupMessage?${queryParams}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); 
            setMessage(data);
            setRoomId(chatroomId);
            
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };
    

    const data = {
        name: userSeq,
        msg,
        date: new Date().toISOString(),
        receiver: userSeq,
        roomId: '11f5bc47-e23e-4e09-a4c7-ec3c6b80991c',
        fileName: '',
        filePath: ''
    };

    // const fetchFileMessage = async()=>{
    //     const queryParams = new URLSearchParams({roomId: chatroomId });
    //     const url = `http://192.168.0.4:9998/getGroupMessage?${queryParams}`;
    //     try{
    //         const response = await fetch(url);
    //         console.log("response:::"+response)
    //     }catch(err){
    //         console.log(err)
    //     }
    // }

    useEffect(() => {
        fetchMessage();
        // fetchFileMessage();
        console.log("chatroomid::"+chatroomId)
    }, [chatroomId]);

    // 파일 선택 이벤트 처리 함수
    const handleFileChange = (event) => {
        const newFile = event.target.files[0];
        if (newFile) {
            setFile(newFile);
            const reader = new FileReader();
            reader.onload = () => {
                if (newFile.type.startsWith('image')) {
                    setPreviewContent(
                        <img src={reader.result} alt="미리보기" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                    );
                } else {
                    setPreviewContent(<p>{newFile.name}</p>);
                }
            };

            if (newFile.type.startsWith('image')) {
                reader.readAsDataURL(newFile);
            } else {
                setPreviewContent(
                    <div className={style.container}>
                        <p className={style.preview}>{newFile.name}</p>
                        <Button variant="primary" onClick={handleUpload}>
                            <FontAwesomeIcon icon={faUpload} /> Upload
                        </Button>
                    </div>
                );
            }
        }
    };

    // 파일 업로드 처리 함수
    const handleUpload = async () => {
        if (!file) {
            alert('파일을 선택하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', '11f5bc47-e23e-4e09-a4c7-ec3c6b80991c');  // roomId 추가
        formData.append('name', '1');      // name 추가

        try {
            const response = await fetch('http://192.168.0.18:9998/uploadFiles', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('파일 업로드 성공');
                fetchMessage();
                // fetchFileMessage();  // 파일 업로드 후 메시지 목록 갱신
            } else {
                setUploadStatus('파일 업로드 실패');
            }
        } catch (error) {
            setUploadStatus('파일 업로드 중 오류 발생');
        }
    };

    // 파일 다운로드 처리 함수
    const handleDownload = async (fileName) => {
        const response = await fetch(`http://192.168.0.18:9998/download/${fileName}`, {
            method: 'GET',
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            console.error('파일 다운로드 실패:', response.statusText);
        }
    };

    const handleMessage = useCallback(async () => {


        console.log('보낼 데이터:', JSON.stringify(data));

        try {
            const response = await fetch('http://192.168.0.18:9998/insertGroupMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // 데이터를 JSON 문자열로 변환
            });

            if (!response.ok) {
                // 에러 발생 시 JSON 형식으로 응답을 처리
                const errorData = await response.json();
                console.error('메시지 전송 실패:', errorData.message);
                return;
            }

            // 응답이 성공적인 경우 JSON 파싱
            const jsonResponse = await response.json();
            setMessage(prevMessage => [...prevMessage, jsonResponse]);
            setMsg("");  // 입력 필드 초기화
        } catch (error) {
            console.error("메시지 전송 중 오류:", error);
        }
    }, [msg, userSeq, chatroomId]);


    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
        <div id="chat-wrap" className="d-flex flex-column" style={{overflowY:"scroll", marginTop: "100px", marginBottom:"53px", marginLeft: "50px"}}>
           <div className="d-flex">
           </div>
            <div id='talk' style={{marginBottom: "30px"}}>
                {message.map((item, idx) => (
                    <div key={idx}>
                        <b>{item.name}</b> [ {new Date(item.date).toLocaleString()}]: <br />
                        {item.fileName == null && (
                            <div><h5>{item.msg}</h5></div>
                        )}
                        {item.fileName && (
                            <Button variant="success" onClick={() => handleDownload(item.fileName)}>
                                <FontAwesomeIcon icon={faDownload} /> {item.fileName} 다운로드
                            </Button>
                        )}
                    </div>
                ))}

            </div>

        </div>
                    <div id='sendZone'style={{position:"fixed", top:"700px", width:"75%"}}>
                    {previewContent}
                    <InputGroup className="mb-3">
                        <Button variant="primary" id="button-addon2" onClick={handleFileInputClick}>
                            <FontAwesomeIcon icon={faPlus} />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }} // 파일 입력 숨기기
                            />
                        </Button>

                        <Form.Control
                            placeholder="메세지를 입력하세요."
                            aria-describedby="basic-addon2"
                            value={msg} onChange={(e) => setMsg(e.target.value)}
                        />
                        <Button variant="secondary" id="button-addon2" onClick={handleMessage} value={chatroomId}>
                            전송
                        </Button>
                    </InputGroup>

            </div>
            </>
    );
}

export default GroupMessage;
