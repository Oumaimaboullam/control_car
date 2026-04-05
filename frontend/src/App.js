import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layout components
import Layout from './components/Layout/Layout';
import PublicLayout from './components/Layout/PublicLayout';

// Auth pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminDemandes from './pages/Admin/Demandes';
import AdminClients from './pages/Admin/Clients';
import AdminTechniciens from './pages/Admin/Techniciens';
import AdminMarquesTypes from './pages/Admin/MarquesTypes';
import AdminProfile from './pages/Admin/Profile';

// Technician pages
import TechnicianDashboard from './pages/Technician/Dashboard';
import TechnicianDemandes from './pages/Technician/Demandes';
import TechnicianProfile from './pages/Technician/Profile';

// Client pages
import ClientDashboard from './pages/Client/Dashboard';
import ClientDemandes from './pages/Client/Demandes';
import ClientHistorique from './pages/Client/Historique';
import ClientProfile from './pages/Client/Profile';

// Shared pages
import Notifications from './pages/Shared/Notifications';
import DemandeDetail from './pages/Shared/DemandeDetail';
import CreateDemande from './pages/Client/CreateDemande';
import DiagnosticForm from './pages/Technician/DiagnosticForm';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      
      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/demandes" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminDemandes />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/clients" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminClients />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/techniciens" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminTechniciens />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/marques-types" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminMarquesTypes />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminProfile />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Technician routes */}
      <Route path="/technician/dashboard" element={
        <ProtectedRoute requiredRole="technicien">
          <Layout>
            <TechnicianDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/technician/demandes" element={
        <ProtectedRoute requiredRole="technicien">
          <Layout>
            <TechnicianDemandes />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/technician/diagnostic/:id" element={
        <ProtectedRoute requiredRole="technicien">
          <Layout>
            <DiagnosticForm />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/technician/profile" element={
        <ProtectedRoute requiredRole="technicien">
          <Layout>
            <TechnicianProfile />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Client routes */}
      <Route path="/client/dashboard" element={
        <ProtectedRoute requiredRole="client">
          <Layout>
            <ClientDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/client/demandes" element={
        <ProtectedRoute requiredRole="client">
          <Layout>
            <ClientDemandes />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/client/demandes/create" element={
        <ProtectedRoute requiredRole="client">
          <Layout>
            <CreateDemande />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/client/historique" element={
        <ProtectedRoute requiredRole="client">
          <Layout>
            <ClientHistorique />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/client/profile" element={
        <ProtectedRoute requiredRole="client">
          <Layout>
            <ClientProfile />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Shared routes */}
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Layout>
            <Notifications />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/demande/:id" element={
        <ProtectedRoute>
          <Layout>
            <DemandeDetail />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : "/login"} />} />
      <Route path="*" element={<Navigate to={user ? `/${user.role}/dashboard` : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
