import React, { useState } from 'react';
import { Eye, EyeOff, Users } from 'lucide-react';


interface FieldConfig {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  validation?: (value: string, allValues: Record<string, string>) => string;
}

interface LoginProps {
  title: string;
  subtitle: string;
  fields: FieldConfig[];
  buttonText: string;
  onSubmit: (values: Record<string, string>) => void;
  bgVideoSrc?: string;
  overlayVideoSrc?: string;
  logoIcon?: React.ReactNode;
  forgetPassword?: boolean;
  onForgetPassword?: () => void;
  footer?: React.ReactNode;
  error?: string;
}

const Login: React.FC<LoginProps> = ({
  title,
  subtitle,
  fields,
  buttonText,
  onSubmit,
  bgVideoSrc = '/blackhole.webm',
  overlayVideoSrc,
  logoIcon = <Users className="w-6 h-6 text-white" />,
  forgetPassword = false,
  onForgetPassword,
  footer,
  error,
}) => {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map(f => [f.name, '']))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate all fields
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.validation) {
        const error = field.validation(values[field.name], values);
        if (error) newErrors[field.name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    setValues(v => ({ ...v, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    onSubmit(values);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 rotate-180 top-[-50%]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
          style={{
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
          }}
        >
          <source src={bgVideoSrc} type="video/webm" />
        </video>
      </div>
      {/* Overlay Video (optional) */}
      {overlayVideoSrc && (
        <div className="absolute inset-0 w-full h-full z-5 top-[50%]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
            style={{
              pointerEvents: 'none',
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 50%, transparent 100%)',
            }}
          >
            <source src={overlayVideoSrc} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Content */}
      <main className="absolute inset-0 z-50 w-full h-full flex items-center justify-center lg:justify-around p-4">
        <div className="hidden lg:block w-1/3">
          <img src="https://v-accel.ai/hero-bg.svg" alt="description" className="w-full h-auto" />
        </div>
        <form
          className="bg-white/0 border border-white/10 p-8 rounded-2xl shadow-3xl flex flex-col gap-4 min-w-[320px] max-w-[90vw] w-full sm:w-[400px]"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
              {logoIcon}
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={
                    field.type === 'password'
                      ? showPassword
                        ? 'text'
                        : 'password'
                      : field.type
                  }
                  value={values[field.name]}
                  onChange={e => handleChange(field.name, e.target.value)}
                  className={`w-full pl-10 pr-4 bg-transparent text-gray-500 backdrop-blur-lg shadow-inner py-3 border border-gray-700 rounded-lg focus:outline-none transition-all duration-200 ${errors[field.name] ? 'border-red-500' : ''
                    }`}
                  placeholder={field.placeholder}
                  required
                />
                {field.icon && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                    {field.icon}
                  </span>
                )}
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
          {/* Forgot password option */}
          {forgetPassword && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                onClick={onForgetPassword}
              >
                Forgot password?
              </button>
            </div>
          )}
          <button
            type="submit"
            className="w-full mt-5 bg-gradient-to-r to-blue-600 from-purple-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 hover:shadow-xl border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              buttonText
            )}
          </button>
          {footer && <div className="mt-4">{footer}</div>}
        </form>
      </main>
    </div>
  );
};

export default Login;