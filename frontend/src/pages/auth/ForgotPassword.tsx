import { useNavigate } from 'react-router-dom';
import Login from '../../components/Login';
import { Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { forgotPassword } from '../../service/auth';
import blackhole from '../../assets/blackhole.webm';
import overlay from '../../assets/stargalaxy.mp4';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const fields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email to reset password',
      icon: <Mail className="w-5 h-5 text-gray-400" />,
      validation: (value: string) => {
        if (!value) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid.';
        return '';
      },
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      await forgotPassword(values.email);
      toast.success('If an account with that email exists, a password reset link has been sent.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <Login
      title="Forgot Password"
      subtitle="We'll email you instructions to reset your password"
      fields={fields}
      buttonText="Send Reset Link"
      onSubmit={handleSubmit}
      bgVideoSrc={blackhole}
      overlayVideoSrc={overlay}
      footer={
        <p className="text-center text-sm text-gray-400">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-blue-500 hover:underline"
          >
            Back to Sign In
          </button>
        </p>
      }
    />
  );
};

export default ForgotPasswordPage; 