import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate(); // useNavigate를 함수의 최상위에서 호출

  const handleMessenger = () => {
    navigate('/messenger'); // 이벤트 핸들러 내에서 navigate 사용
  };
  
  const handleLogin = () =>{
    navigate('/login');
  }

  return (
    <div>
      <button onClick={handleMessenger}>메신저</button><br></br>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default App;
