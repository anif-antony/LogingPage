import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../../components/Login';
import { Mail, KeyRound, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { loginUser, registerUser } from '../../service/auth';
import blackhole from '../../assets/blackhole.webm';
import overlay from '../../assets/stargalaxy.mp4';
import { AxiosError } from 'axios';

type View = 'login' | 'signup';

const LoginPage = () => {
  const [view, setView] = useState<View>('login');
  const navigate = useNavigate();

  const loginFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      icon: <Mail className="w-5 h-5 text-gray-400" />,
      validation: (value: string) => {
        if (!value) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid.';
        return '';
      },
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      icon: <KeyRound className="w-5 h-5 text-gray-400" />,
      validation: (value: string) => {
        if (!value) return 'Password is required.';
        return '';
      },
    },
  ];

  const signupFields = [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      icon: <User className="w-5 h-5 text-gray-400" />,
       validation: (value: string) => {
        if (!value) return 'Name is required.';
        return '';
      },
    },
    ...loginFields,
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      icon: <KeyRound className="w-5 h-5 text-gray-400" />,
      validation: (value: string, allValues: Record<string, string>) => {
        if (!value) return 'Please confirm your password.';
        if (value !== allValues.password) return 'Passwords do not match.';
        return '';
      },
    },
  ];

  const handleLoginSubmit = async (values: Record<string, string>) => {
    try {
      const response = await loginUser(values);
      console.log('Login success:', response.data);
      toast.success('Login successful!');
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleSignupSubmit = async (values: Record<string, string>) => {
    try {
      const response = await registerUser(values);
      console.log('Signup success:', response.data);
      toast.success('Registration successful! Please log in.');
      setView('login'); // Switch to login view
    } catch (error) {
      console.error('Signup error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const isLogin = view === 'login';

  return (
    <Login
      title={isLogin ? 'Welcome Back' : 'Create Account'}
      subtitle={isLogin ? 'Sign in to continue' : 'Get started with a new account'}
      fields={isLogin ? loginFields : signupFields}
      buttonText={isLogin ? 'Sign In' : 'Sign Up'}
      onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}
      bgVideoSrc={blackhole}
      overlayVideoSrc={overlay}
      forgetPassword={isLogin}
      onForgetPassword={() => navigate('/forgot-password')}
      footer={
        <p className="text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            onClick={() => setView(isLogin ? 'signup' : 'login')}
            className="font-medium text-blue-500 hover:underline ml-1"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      }
    />
  );
};

export default LoginPage; 