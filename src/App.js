import { useNavigate } from 'react-router-dom';
import { ChatRoomProvider } from './component/messenger/groupMessengerContext';

function App() {
  // const ChatRoomContext = createContext({ chatRoomId: null, setChatRoomId: undefined });
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

const root = () =>{
  <ChatRoomProvider>
    <App />
  </ChatRoomProvider>
}

export default App;
