import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Car,
  Wrench
} from 'lucide-react';

const TechnicianDashboard = () => {
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
      // Fetch all demandes (in real app, this would be filtered by assigned technician)
      const response = await fetch('/api/demandes');
      const data = await response.json();
      
      if (data.records) {
        const demandes = data.records;
        setRecentDemandes(demandes.slice(0, 5));
        
        // Calculate stats
        const stats = demandes.reduce((acc, demande) => {
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord technicien</h1>
        <p className="text-gray-600 mt-2">
          Gérez vos missions de diagnostic
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total missions</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">À démarrer</p>
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
            <Wrench className="w-8 h-8 text-blue-200" />
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
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Missions récentes</h2>
          <Link to="/technician/demandes" className="text-primary hover:underline text-sm">
            Voir tout
          </Link>
        </div>
        
        {recentDemandes.length > 0 ? (
          <div className="space-y-3">
            {recentDemandes.map((demande) => (
              <div key={demande.id_demande} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {demande.marque} {demande.type}
                    </h3>
                    <p className="text-sm text-gray-600">{demande.matricule}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {demande.client_nom} {demande.client_prenom}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(demande.status)}
                    <span className={`status-badge ${getStatusClass(demande.status)}`}>
                      {demande.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p>{demande.date}</p>
                    <p>{demande.time}</p>
                  </div>

                  <div className="flex space-x-2">
                    {demande.status === 'en attente' && (
                      <button className="btn-primary text-sm py-1 px-3">
                        Démarrer
                      </button>
                    )}
                    {demande.status === 'en cours' && (
                      <Link 
                        to={`/technician/diagnostic/${demande.id_demande}`}
                        className="btn-primary text-sm py-1 px-3"
                      >
                        Continuer
                      </Link>
                    )}
                    <Link 
                      to={`/demande/${demande.id_demande}`}
                      className="btn-outline text-sm py-1 px-3"
                    >
                      Détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune mission assignée</h3>
            <p className="text-gray-600">
              Vous n'avez aucune mission de diagnostic pour le moment
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions rapides</h3>
          <div className="space-y-2">
            <Link to="/technician/demandes" className="btn-primary w-full text-center py-2">
              <FileText className="w-4 h-4 mr-2 inline" />
              Voir toutes les missions
            </Link>
            <Link to="/technician/profile" className="btn-outline w-full text-center py-2">
              <Wrench className="w-4 h-4 mr-2 inline" />
              Mon profil
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Statistiques</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux de complétion</span>
              <span className="font-semibold text-green-600">
                {stats.total > 0 ? Math.round((stats.terminees / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Missions en attente</span>
              <span className="font-semibold text-yellow-600">{stats.enAttente}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Missions actives</span>
              <span className="font-semibold text-blue-600">{stats.enCours}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
