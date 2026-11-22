import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/auth-context';
import AppLayout from './layouts/app-layout';
import Landing from './pages/landing';
import RedirectLink from './pages/redirect-link';
import Auth from './pages/auth';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
          </Route>
          <Route path="/:id" element={<RedirectLink />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
