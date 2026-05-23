import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Users, ArrowLeft, Edit2, Trash2, Save, X, Plus } from 'lucide-react';
import api from '../services/api';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'attendant', 'driver']),
});

const updateUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['admin', 'attendant', 'driver']).optional(),
});

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const response = await api.get('/users', {
        params: { page, limit: 10 },
      });
      return response.data;
    },
  });

  const addForm = useForm({
    resolver: zodResolver(userSchema),
  });

  const editForm = useForm({
    resolver: zodResolver(updateUserSchema),
  });

  const addMutation = useMutation({
    mutationFn: async (userData) => {
      return await api.post('/auth/register', userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User added successfully!');
      setShowAddForm(false);
      addForm.reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await api.put(`/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User updated successfully!');
      setEditingUserId(null);
      editForm.reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  const startEdit = (user) => {
    setEditingUserId(user.id);
    editForm.setValue('firstName', user.firstName);
    editForm.setValue('lastName', user.lastName);
    editForm.setValue('email', user.email);
    editForm.setValue('role', user.role);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    editForm.reset();
  };

  const onSubmitAdd = (data) => {
    addMutation.mutate(data);
  };

  const onSubmitUpdate = (data) => {
    updateMutation.mutate({ id: editingUserId, data });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      attendant: 'bg-blue-100 text-blue-800',
      driver: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (isLoading) return <div className="p-8 text-center animate-fadeIn">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600 animate-fadeIn">Error loading users</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <Users className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 animate-fadeIn">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition animate-pulse-hover"
          >
            <Plus className="w-5 h-5" />
            {showAddForm ? 'Cancel' : 'Add New User'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 animate-scaleIn">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add New User</h2>
            <form onSubmit={addForm.handleSubmit(onSubmitAdd)} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  {...addForm.register('firstName')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {addForm.formState.errors.firstName && (
                  <p className="text-sm text-red-600">{addForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  {...addForm.register('lastName')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {addForm.formState.errors.lastName && (
                  <p className="text-sm text-red-600">{addForm.formState.errors.lastName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...addForm.register('email')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {addForm.formState.errors.email && (
                  <p className="text-sm text-red-600">{addForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  {...addForm.register('password')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {addForm.formState.errors.password && (
                  <p className="text-sm text-red-600">{addForm.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  {...addForm.register('role')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="admin">Admin</option>
                  <option value="attendant">Attendant</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
              <div className="md:col-span-5 flex gap-3">
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Add User
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((user, index) => (
                  <tr key={user.id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                    {editingUserId === user.id ? (
                      <td colSpan="4">
                        <form onSubmit={editForm.handleSubmit(onSubmitUpdate)} className="p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                              <input
                                type="text"
                                {...editForm.register('firstName')}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                              {editForm.formState.errors.firstName && (
                                <p className="text-sm text-red-600">{editForm.formState.errors.firstName.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                              <input
                                type="text"
                                {...editForm.register('lastName')}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                              {editForm.formState.errors.lastName && (
                                <p className="text-sm text-red-600">{editForm.formState.errors.lastName.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                {...editForm.register('email')}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                              {editForm.formState.errors.email && (
                                <p className="text-sm text-red-600">{editForm.formState.errors.email.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                              <select
                                {...editForm.register('role')}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                              >
                                <option value="admin">Admin</option>
                                <option value="attendant">Attendant</option>
                                <option value="driver">Driver</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-4">
                            <button
                              type="submit"
                              disabled={updateMutation.isPending}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteMutation.isPending}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {data?.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8 animate-fadeIn">
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

export default UserManagement;
