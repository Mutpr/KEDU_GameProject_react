import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleMessenger = () => {
    navigate('/messenger/');
  };
  const handleLogin = () => {
    navigate('/login');
  }

  // Render two buttons for navigation
  return (
    <div>
      <button onClick={handleMessenger}>메신저</button><br></br>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default App;
