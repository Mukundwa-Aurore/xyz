import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, Car } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      login(response.data.token, response.data.user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 animate-scaleIn">
        <div className="text-center mb-10 animate-slideDown">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-3xl shadow-xl mb-6">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            XWZ Parking
          </h1>
          <p className="text-slate-500 text-lg">Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-5 animate-fadeIn delay-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
                First Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-6 h-6 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="text"
                  {...register('firstName')}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <p className="mt-3 ml-1 text-sm text-red-500 font-medium">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
                Last Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-6 h-6 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="text"
                  {...register('lastName')}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && (
                <p className="mt-3 ml-1 text-sm text-red-500 font-medium">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="animate-fadeIn delay-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-6 h-6 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
              </div>
              <input
                type="email"
                {...register('email')}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-3 ml-1 text-sm text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="animate-fadeIn delay-300">
            <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-6 h-6 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
              </div>
              <input
                type="password"
                {...register('password')}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-3 ml-1 text-sm text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 focus:ring-4 focus:ring-purple-200 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 animate-fadeIn delay-400"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                Creating account...
              </span>
            ) : (
              <>
                <UserPlus className="w-6 h-6" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-600 text-base animate-fadeIn delay-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
