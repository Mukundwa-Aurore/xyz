import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Lock, Mail, LogIn, Car } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.token, response.data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 animate-scaleIn">
        <div className="text-center mb-10 animate-slideDown">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl mb-6">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            XWZ Parking
          </h1>
          <p className="text-slate-500 text-lg">Welcome back! Please sign in</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div className="animate-fadeIn delay-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="email"
                {...register('email')}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-3 ml-1 text-sm text-red-500 font-medium flex items-center gap-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="animate-fadeIn delay-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                {...register('password')}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-3 ml-1 text-sm text-red-500 font-medium flex items-center gap-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 animate-fadeIn delay-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                Signing in...
              </span>
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-10 space-y-6 animate-fadeIn delay-400">
          <p className="text-center text-slate-600 text-base">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
            >
              Create account
            </Link>
          </p>
          
          <div className="pt-6 border-t border-slate-200">
            <p className="text-center text-slate-400 text-xs uppercase tracking-wider mb-3">
              Default Admin Credentials
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 text-center space-y-1">
              <p className="text-slate-700 font-medium text-sm">
                Email: <span className="font-bold text-indigo-600">admin@xwzparking.com</span>
              </p>
              <p className="text-slate-700 font-medium text-sm">
                Password: <span className="font-bold text-indigo-600">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
