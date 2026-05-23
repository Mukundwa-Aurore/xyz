import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Car,
  MapPin,
  FileText,
  LogOut,
  Users,
  DollarSign,
  Clock,
  UserCog,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const { data: parkingData } = useQuery({
    queryKey: ['dashboard-parking'],
    queryFn: async () => {
      const response = await api.get('/parking', { params: { limit: 100 } });
      return response.data;
    },
  });

  const { data: logsData } = useQuery({
    queryKey: ['dashboard-logs'],
    queryFn: async () => {
      const response = await api.get('/parking-logs', { params: { limit: 100 } });
      return response.data;
    },
  });

  const totalParkingSpaces = parkingData?.data?.reduce((sum, p) => sum + p.totalSpaces, 0) || 0;
  const availableParkingSpaces = parkingData?.data?.reduce((sum, p) => sum + p.availableSpaces, 0) || 0;
  const parkedCars = logsData?.data?.filter((log) => log.status === 'parked').length || 0;
  const totalRevenue = logsData?.data?.filter((log) => log.status === 'exited').reduce((sum, log) => sum + parseFloat(log.chargedAmount), 0) || 0;

  const menuItems = [
    {
      title: 'User Management',
      icon: UserCog,
      path: '/users',
      roles: ['admin'],
      color: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Parking Locations',
      icon: MapPin,
      path: '/parking',
      roles: ['admin', 'attendant', 'driver'],
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      title: 'Parking Logs',
      icon: Car,
      path: '/parking-logs',
      roles: ['admin', 'attendant'],
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Reports',
      icon: FileText,
      path: '/reports',
      roles: ['admin'],
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100 text-purple-600',
    },
  ];

  const stats = [
    {
      title: 'Total Parking Spaces',
      value: totalParkingSpaces,
      icon: MapPin,
      iconBg: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200',
      delay: 'delay-100',
    },
    {
      title: 'Available Spaces',
      value: availableParkingSpaces,
      icon: Clock,
      iconBg: 'bg-green-100 text-green-600',
      borderColor: 'border-green-200',
      valueColor: 'text-green-600',
      delay: 'delay-200',
    },
    {
      title: 'Cars Parked Now',
      value: parkedCars,
      icon: Car,
      iconBg: 'bg-yellow-100 text-yellow-600',
      borderColor: 'border-yellow-200',
      valueColor: 'text-yellow-600',
      delay: 'delay-300',
    },
    {
      title: 'Total Revenue',
      value: `${totalRevenue.toFixed(2)} RWF`,
      icon: DollarSign,
      iconBg: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-200',
      valueColor: 'text-purple-600',
      delay: 'delay-400',
      show: user?.role === 'admin',
    },
  ].filter(stat => stat.show !== false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200 sticky top-0 z-50 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                  XWZ Parking Dashboard
                </h1>
                <p className="text-slate-500 text-sm">Welcome back!</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-slate-700 font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-slate-500 text-sm capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {user?.role !== 'driver' && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 animate-fadeIn">
              Overview Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className={`bg-white p-7 rounded-2xl shadow-lg border-2 ${stat.borderColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn ${stat.delay}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-4 ${stat.iconBg} rounded-xl shadow-lg`}>
                        <Icon className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                        <p className={`text-4xl font-bold mt-1 ${stat.valueColor || 'text-slate-800'}`}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 animate-fadeIn delay-300">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems
              .filter((item) => item.roles.includes(user?.role))
              .map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className="group bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <div className="flex flex-col gap-4">
                      <div className={`p-4 ${item.iconBg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                          Manage {item.title.toLowerCase()}
                        </p>
                      </div>
                      <div className="flex items-center text-indigo-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Go to page
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
