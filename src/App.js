import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate(); // Get the navigate function from useNavigate hook

  // Handler for navigating to the messenger route
  const handleMessenger = () => {
    navigate('/messenger'); // Navigate to the /messenger route
  };
  
  // Handler for navigating to the login route
  const handleLogin = () => {
    navigate('/login'); // Navigate to the /login route
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
