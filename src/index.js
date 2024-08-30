import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Messenger from './component/messenger/messenger';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route, Router} from 'react-router-dom';
import LoginForm from './component/user/login'
import { WebSocketProvider } from './WebSocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <WebSocketProvider>
      <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='/messenger/:userName' element={<Messenger/>}></Route>
        <Route path='/login' element={<LoginForm/>}></Route>
      </Routes>
      </WebSocketProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
