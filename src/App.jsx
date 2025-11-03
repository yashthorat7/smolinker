import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/app-layout';
import Landing from './pages/landing';
import Auth from './pages/auth';
import Dashboard from './pages/dashboard';
import Link from './pages/link';
import RedirectLink from './pages/redirect-link';
import UrlProvider from './context';
import RequireAuth from './components/RequireAuth';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/link/:id',
        element: (
          <RequireAuth>
            <Link />
          </RequireAuth>
        ),
      },
      {
        path: '/:id',
        element: <RedirectLink />,
      },
    ],
  },
]);

const App = () => {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
};

export default App;
