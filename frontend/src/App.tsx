import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import LoginPage from './pages/auth/Login';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound';
import HomePage from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password/:resettoken', element: <ResetPasswordPage /> },
      { path: 'home', element: <HomePage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
