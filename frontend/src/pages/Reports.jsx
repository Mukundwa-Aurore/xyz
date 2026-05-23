import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, ArrowLeft, Calendar, DollarSign } from 'lucide-react';
import api from '../services/api';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('outgoing');

  const { data, isLoading, error } = useQuery({
    queryKey: ['reports', reportType, startDate, endDate],
    queryFn: async () => {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get(`/reports/${reportType}`, { params });
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <FileText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Reports</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex gap-2">
              <button
                onClick={() => setReportType('outgoing')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  reportType === 'outgoing'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Outgoing Cars
              </button>
              <button
                onClick={() => setReportType('entered')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  reportType === 'entered'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Entered Cars
              </button>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {reportType === 'outgoing' && data?.totalAmount !== undefined && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Amount Charged</p>
                <p className="text-white text-3xl font-bold">{data.totalAmount} RWF</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">Error loading reports</div>
        ) : (
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
                    {reportType === 'outgoing' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exit Time
                      </th>
                    )}
                    {reportType === 'outgoing' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Charged Amount
                      </th>
                    )}
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.entryDateTime).toLocaleString()}
                      </td>
                      {reportType === 'outgoing' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entry.exitDateTime).toLocaleString()}
                        </td>
                      )}
                      {reportType === 'outgoing' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.chargedAmount} RWF
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
