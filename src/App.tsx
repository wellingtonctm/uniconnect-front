import React from 'react';
import Message from '@/pages/Messages';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import FormMessage from '@/pages/form-message';
import { AuthProvider, AuthAdminProvider } from './context/AuthProvider';
import EventsManager from './pages/events-manager';
import EventDetails from './pages/event-details';
import UserDetails from './pages/user-details';
import { useAuthAdmin } from './hooks/useAuth';

interface ProtectedComponentProps {
  children: React.ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ children }) => {
  const { pass } = useAuthAdmin();

  console.log(pass)

  // Verifica se o usuário está autenticado e tem a permissão necessária
  if (pass)
    return <>{children}</>;

};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthProvider><Outlet /></AuthProvider>}>
          <Route index element={<FormMessage />} />
          <Route path='/mural' element={<Message />} />
        </Route>

        <Route path='/gerencia' element={<><AuthAdminProvider><Outlet /></AuthAdminProvider></>}>
          <Route path='/gerencia' element={<ProtectedComponent><EventsManager /> </ProtectedComponent>} />
          <Route path='/gerencia/:id' element={<ProtectedComponent><EventDetails /></ProtectedComponent>} />
          <Route path='/gerencia/user/:id' element={<ProtectedComponent><UserDetails /></ProtectedComponent>} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
