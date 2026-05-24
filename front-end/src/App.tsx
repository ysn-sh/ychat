import { Routes, Route } from 'react-router-dom';

import { ChatLayout } from "@/layouts/ChatLayout"
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { ChatPage } from "@/pages/ChatPage"
import { RegisterPage } from './pages/RegisterPage';
 
function App() {

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/chat/*" element={
          <ChatLayout>
            <ChatPage />
          </ChatLayout>
          }/>
      </Routes>
    </AppLayout>
  )
}

export default App
