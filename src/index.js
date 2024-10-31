import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import Messenger from './component/messenger/messenger';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import LoginForm from './component/user/login/login'
import Friend from './component/friend/friend';
import { WebSocketProvider } from './WebSocketContext';
import Register from './component/user/register/register';
import FriendRequest from './component/friend/friendRequest';
import MessengerList from './component/messenger/messengerList';
import SideBar from './component/sidebar';
import GroupMessage from './component/messenger/groupMessenger'
import { ChatRoomProvider } from './component/messenger/groupMessengerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
  <ChatRoomProvider>
    <WebSocketProvider>
      <Routes>
        <Route path='/' element={<App />}></Route>
        <Route path='/messenger/:userName' element={<Messenger />}></Route>
        <Route path='/login' element={<LoginForm />}></Route>
        <Route path='/friend/:userSeq' element={<Friend/>}></Route>
        <Route path="/friendRequest/:userSeq" element={<FriendRequest/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path="/messengerList/:roomId/:userSeq" element={<MessengerList/>}></Route>
        <Route path="/sidebar" element={<SideBar/>}></Route>
        <Route path="/groupMessenger/:chatroomId" element={<GroupMessage/>}></Route>
      </Routes>
    </WebSocketProvider>
    </ChatRoomProvider>
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
