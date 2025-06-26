import { useNavigate, useParams } from 'react-router-dom';
import Login from '../../components/Login';
import { KeyRound } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { resetPassword } from '../../service/auth';
import blackhole from '../../assets/blackhole.webm';
import overlay from '../../assets/stargalaxy.mp4';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { resettoken } = useParams<{ resettoken: string }>();

  const fields = [
    {
      name: 'password',
      type: 'password',
      label: 'New Password',
      placeholder: 'Enter your new password',
      icon: <KeyRound className="w-5 h-5 text-gray-400" />,
      validation: (value: string) => {
        if (!value) return 'Password is required.';
        if (value.length < 6) return 'Password must be at least 6 characters.';
        return '';
      },
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm New Password',
      placeholder: 'Confirm your new password',
      icon: <KeyRound className="w-5 h-5 text-gray-400" />,
      validation: (value: string, allValues: Record<string, string>) => {
        if (!value) return 'Please confirm your password.';
        if (value !== allValues.password) return 'Passwords do not match.';
        return '';
      },
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    if (!resettoken) {
      toast.error('Invalid or missing reset token.');
      return;
    }
    try {
      await resetPassword(values.password, resettoken);
      toast.success('Password has been reset successfully! You can now log in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <Login
      title="Reset Password"
      subtitle="Enter your new password below"
      fields={fields}
      buttonText="Reset Password"
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

export default ResetPasswordPage;
