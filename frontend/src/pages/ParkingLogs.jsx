import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Car, Plus, ArrowLeft, LogOut, FileText } from 'lucide-react';
import api from '../services/api';

const parkingLogSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required'),
  parkingCode: z.string().min(1, 'Parking code is required'),
});

const ParkingLogs = () => {
  const queryClient = useQueryClient();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['parkingLogs', page],
    queryFn: async () => {
      const response = await api.get('/parking-logs', {
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
    resolver: zodResolver(parkingLogSchema),
  });

  const entryMutation = useMutation({
    mutationFn: async (data) => {
      return await api.post('/parking-logs', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['parkingLogs']);
      toast.success('Parking log created successfully!');
      setShowEntryForm(false);
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create parking log');
    },
  });

  const exitMutation = useMutation({
    mutationFn: async (id) => {
      return await api.put(`/parking-logs/${id}/exit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['parkingLogs']);
      toast.success('Parking exit processed successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to process parking exit');
    },
  });

  const onSubmitEntry = (data) => {
    entryMutation.mutate(data);
  };

  const handleExit = (id) => {
    if (window.confirm('Are you sure you want to process this parking exit?')) {
      exitMutation.mutate(id);
    }
  };

  const downloadTicket = async (id) => {
    try {
      const response = await api.get(`/parking-logs/${id}/ticket`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download ticket');
    }
  };

  const downloadBill = async (id) => {
    try {
      const response = await api.get(`/parking-logs/${id}/bill`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download bill');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error loading parking logs</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <Car className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">Parking Logs (Active Sessions)</h1>
            </div>
            <button
              onClick={() => setShowEntryForm(!showEntryForm)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Parking Entry
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showEntryForm && (
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Parking Entry</h2>
            <form onSubmit={handleSubmit(onSubmitEntry)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                <input
                  type="text"
                  {...register('plateNumber')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="RAB123A"
                />
                {errors.plateNumber && <p className="text-sm text-red-600">{errors.plateNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parking Code</label>
                <input
                  type="text"
                  {...register('parkingCode')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="PARK001"
                />
                {errors.parkingCode && <p className="text-sm text-red-600">{errors.parkingCode.message}</p>}
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={entryMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {entryMutation.isPending ? 'Creating...' : 'Create Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEntryForm(false);
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

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exit Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Charged Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.plateNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.ParkingLocation?.name}</div>
                      <div className="text-sm text-gray-500">{entry.parkingCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.entryDateTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.exitDateTime ? new Date(entry.exitDateTime).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        entry.status === 'parked' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.chargedAmount > 0 ? `${entry.chargedAmount} RWF` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadTicket(entry.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        {entry.status === 'parked' ? (
                          <button
                            onClick={() => handleExit(entry.id)}
                            disabled={exitMutation.isPending}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            <LogOut className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => downloadBill(entry.id)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default ParkingLogs;
