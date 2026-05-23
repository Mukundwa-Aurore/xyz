import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Parking from './pages/Parking';
import ParkingLogs from './pages/ParkingLogs';
import Reports from './pages/Reports';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
      />
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parking"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attendant', 'driver']}>
            <Parking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parking-logs"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attendant']}>
            <ParkingLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
