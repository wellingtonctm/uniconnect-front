import React from 'react';
import Message from '@/pages/Messages';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import FormMessage from '@/pages/form-message';
import { AuthProvider } from './context/AuthProvider';
import EventsManager from './pages/events-manager';
import EventDetails from './pages/event-details';
import UserDetails from './pages/user-details';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthProvider><Outlet /></AuthProvider>}>
          <Route index element={<FormMessage />} />
          <Route path='/mural' element={<Message />} />
          <Route path='/gerencia' element={<EventsManager />} />
          <Route path='/gerencia/:id' element={<EventDetails />} />
          <Route path='/gerencia/user/:id' element={<UserDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
