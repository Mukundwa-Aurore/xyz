import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { MapPin, Plus, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const parkingSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  totalSpaces: z.number().int().min(1, 'Total spaces must be at least 1'),
  location: z.string().min(1, 'Location is required'),
  hourlyFee: z.number().min(0, 'Fee must be positive'),
});

const Parking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['parking', page],
    queryFn: async () => {
      const response = await api.get('/parking', {
        params: { page, limit: 10 },
      });
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(parkingSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      return await api.post('/parking', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['parking']);
      toast.success('Parking location created successfully!');
      setShowForm(false);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create parking location');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error loading parking locations</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <MapPin className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">Parking Locations</h1>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" />
                Add Parking Location
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && user?.role === 'admin' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Parking Location</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  {...register('code')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="PARK001"
                />
                {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parking Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Downtown Parking"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Spaces</label>
                <input
                  type="number"
                  {...register('totalSpaces', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="50"
                />
                {errors.totalSpaces && <p className="text-sm text-red-600">{errors.totalSpaces.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Kigali, Rwanda"
                />
                {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Fee (RWF)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('hourlyFee', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="500"
                />
                {errors.hourlyFee && <p className="text-sm text-red-600">{errors.hourlyFee.message}</p>}
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {mutation.isPending ? 'Creating...' : 'Create Parking Location'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((parking) => (
            <div key={parking.code} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{parking.name}</h3>
                  <p className="text-sm text-gray-500">Code: {parking.code}</p>
                </div>
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Location:</span> {parking.location}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Spaces:</span> {parking.totalSpaces}
                  </div>
                  <div>
                    <span className="font-medium">Available:</span>
                    <span className={`ml-1 font-semibold ${parking.availableSpaces > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parking.availableSpaces}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fee per Hour:</span> {parking.hourlyFee} RWF
                </p>
              </div>
            </div>
          ))}
        </div>

        {data?.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {data.currentPage} of {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => (p < data.totalPages ? p + 1 : p))}
              disabled={page === data.totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parking;
