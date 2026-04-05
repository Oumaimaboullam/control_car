import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Car, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserCheck,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDemandes: 0,
    totalClients: 0,
    totalTechniciens: 0,
    enAttente: 0,
    enCours: 0,
    terminees: 0,
    annulees: 0
  });
  const [recentDemandes, setRecentDemandes] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch demandes
      const demandesResponse = await fetch('/api/demandes');
      const demandesData = await demandesResponse.json();
      
      // Fetch users
      const usersResponse = await fetch('/api/users');
      const usersData = await usersResponse.json();

      if (demandesData.records) {
        const demandes = demandesData.records;
        setRecentDemandes(demandes.slice(0, 5));
        
        // Calculate demande stats
        const demandeStats = demandes.reduce((acc, demande) => {
          acc.totalDemandes++;
          switch (demande.status) {
            case 'en attente':
              acc.enAttente++;
              break;
            case 'en cours':
              acc.enCours++;
              break;
            case 'terminer':
              acc.terminees++;
              break;
            case 'annuler':
              acc.annulees++;
              break;
          }
          return acc;
        }, { 
          totalDemandes: 0, 
          enAttente: 0, 
          enCours: 0, 
          terminees: 0, 
          annulees: 0 
        });

        setStats(prev => ({ ...prev, ...demandeStats }));
      }

      if (usersData.records) {
        const users = usersData.records;
        setRecentUsers(users.slice(0, 5));
        
        // Calculate user stats
        const userStats = users.reduce((acc, user) => {
          if (user.role === 'client') acc.totalClients++;
          if (user.role === 'technicien') acc.totalTechniciens++;
          return acc;
        }, { totalClients: 0, totalTechniciens: 0 });

        setStats(prev => ({ ...prev, ...userStats }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en attente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'en cours':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'terminer':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'annuler':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'en attente':
        return 'status-en-attente';
      case 'en cours':
        return 'status-en-cours';
      case 'terminer':
        return 'status-terminer';
      case 'annuler':
        return 'status-annuler';
      default:
        return 'status-en-attente';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'client':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'technicien':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'admin':
        return <Settings className="w-4 h-4 text-purple-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de la plateforme Control-Car
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total demandes</p>
              <p className="text-3xl font-bold mt-2">{stats.totalDemandes}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total clients</p>
              <p className="text-3xl font-bold mt-2">{stats.totalClients}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total techniciens</p>
              <p className="text-3xl font-bold mt-2">{stats.totalTechniciens}</p>
            </div>
            <UserCheck className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Taux de complétion</p>
              <p className="text-3xl font-bold mt-2">
                {stats.totalDemandes > 0 
                  ? Math.round((stats.terminees / stats.totalDemandes) * 100) 
                  : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.enAttente}</p>
          <p className="text-gray-600">En attente</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.enCours}</p>
          <p className="text-gray-600">En cours</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.terminees}</p>
          <p className="text-gray-600">Terminées</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.annulees}</p>
          <p className="text-gray-600">Annulées</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Demandes */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Demandes récentes</h2>
            <Link to="/admin/demandes" className="text-primary hover:underline text-sm">
              Voir tout
            </Link>
          </div>
          
          {recentDemandes.length > 0 ? (
            <div className="space-y-3">
              {recentDemandes.map((demande) => (
                <div key={demande.id_demande} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {demande.marque} {demande.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {demande.client_nom} {demande.client_prenom} • {demande.matricule}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`status-badge ${getStatusClass(demande.status)}`}>
                      {demande.status}
                    </span>
                    <Link 
                      to={`/demande/${demande.id_demande}`}
                      className="text-primary hover:underline text-sm"
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune demande récente</p>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Utilisateurs récents</h2>
            <Link to="/admin/clients" className="text-primary hover:underline text-sm">
              Voir tout
            </Link>
          </div>
          
          {recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.iduser} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(user.role)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.nom} {user.prenom}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.email} • {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun utilisateur récent</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/demandes" className="btn-primary text-center py-3">
            <FileText className="w-5 h-5 mr-2 inline" />
            Gérer les demandes
          </Link>
          <Link to="/admin/clients" className="btn-secondary text-center py-3">
            <Users className="w-5 h-5 mr-2 inline" />
            Gérer les clients
          </Link>
          <Link to="/admin/techniciens" className="btn-outline text-center py-3">
            <UserCheck className="w-5 h-5 mr-2 inline" />
            Gérer les techniciens
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
