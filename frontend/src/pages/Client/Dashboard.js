import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    enCours: 0,
    terminees: 0
  });
  const [recentDemandes, setRecentDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's demandes
      const response = await fetch('/api/demandes?user=true');
      const data = await response.json();
      
      if (data.records) {
        setRecentDemandes(data.records.slice(0, 5));
        
        // Calculate stats
        const stats = data.records.reduce((acc, demande) => {
          acc.total++;
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
          }
          return acc;
        }, { total: 0, enAttente: 0, enCours: 0, terminees: 0 });
        
        setStats(stats);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">
            Bienvenue, {user?.nom} {user?.prenom}
          </p>
        </div>
        <Link to="/client/demandes/create" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nouvelle demande</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total demandes</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">En attente</p>
              <p className="text-3xl font-bold mt-2">{stats.enAttente}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">En cours</p>
              <p className="text-3xl font-bold mt-2">{stats.enCours}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Terminées</p>
              <p className="text-3xl font-bold mt-2">{stats.terminees}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Recent Demandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Demandes récentes</h2>
            <Link to="/client/demandes" className="text-primary hover:underline text-sm">
              Voir tout
            </Link>
          </div>
          
          {recentDemandes.length > 0 ? (
            <div className="space-y-3">
              {recentDemandes.map((demande) => (
                <div key={demande.id_demande} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {demande.marque} {demande.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {demande.matricule} • {demande.date}
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
              <p className="text-gray-600">Aucune demande trouvée</p>
              <Link to="/client/demandes/create" className="btn-primary mt-4 inline-block">
                Créer une demande
              </Link>
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Notifications récentes</h2>
            <Link to="/notifications" className="text-primary hover:underline text-sm">
              Voir tout
            </Link>
          </div>
          
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id_notif} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">{notification.text}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(notification.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune notification</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
