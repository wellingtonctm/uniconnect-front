import React from 'react';
import Message from '@/pages/Messages';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import FormMessage from '@/pages/form-message';
import { AuthProvider } from './context/AuthProvider';
import EventsManager from './pages/events-manager';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthProvider><Outlet /></AuthProvider>}>
          <Route index  element={<FormMessage />} />
          <Route path='/evento' element={<Message />} />
          <Route path='/gerencia' element={<EventsManager />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
