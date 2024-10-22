import React from 'react';
import Message from './pages/Messages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Message />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
