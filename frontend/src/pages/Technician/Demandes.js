import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  Eye,
  Play,
  Calendar,
  MapPin,
  User,
  Wrench
} from 'lucide-react';

const TechnicianDemandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDemandes();
  }, []);

  useEffect(() => {
    filterDemandes();
  }, [demandes, searchTerm, statusFilter]);

  const fetchDemandes = async () => {
    try {
      const response = await fetch('/api/demandes');
      const data = await response.json();
      
      if (data.records) {
        // En réalité, filtrer par technicien assigné
        setDemandes(data.records);
      }
    } catch (error) {
      console.error('Error fetching demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDemandes = () => {
    let filtered = demandes;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(demande => demande.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(demande => 
        demande.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${demande.client_nom} ${demande.client_prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDemandes(filtered);
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

  const startDiagnostic = async (id) => {
    try {
      const response = await fetch('/api/demandes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_demande: id,
          status: 'en cours',
          iduser: demandes.find(d => d.id_demande === id)?.iduser
        }),
      });

      if (response.ok) {
        fetchDemandes();
      }
    } catch (error) {
      console.error('Error starting diagnostic:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Commandes assignées</h1>
        <p className="text-gray-600 mt-2">
          Gérez les demandes de diagnostic qui vous sont assignées
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par client, véhicule..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="en attente">En attente</option>
              <option value="en cours">En cours</option>
              <option value="terminer">Terminé</option>
              <option value="annuler">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{demandes.length}</p>
          <p className="text-gray-600">Total missions</p>
        </div>
        <div className="card text-center">
          <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-600">
            {demandes.filter(d => d.status === 'en attente').length}
          </p>
          <p className="text-gray-600">À démarrer</p>
        </div>
        <div className="card text-center">
          <Wrench className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">
            {demandes.filter(d => d.status === 'en cours').length}
          </p>
          <p className="text-gray-600">En cours</p>
        </div>
        <div className="card text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">
            {demandes.filter(d => d.status === 'terminer').length}
          </p>
          <p className="text-gray-600">Terminées</p>
        </div>
      </div>

      {/* Demandes Grid */}
      {filteredDemandes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDemandes.map((demande) => (
            <div key={demande.id_demande} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {demande.marque} {demande.type}
                  </h3>
                  <p className="text-gray-600">{demande.matricule}</p>
                </div>
                <span className={`status-badge ${getStatusClass(demande.status)}`}>
                  {demande.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  {demande.client_nom} {demande.client_prenom}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {demande.date} à {demande.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {demande.adresse}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  N°{demande.number}
                </div>
              </div>

              {/* Actions based on status */}
              <div className="space-y-2">
                {demande.status === 'en attente' && (
                  <button
                    onClick={() => startDiagnostic(demande.id_demande)}
                    className="btn-primary w-full py-2 flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Démarrer le diagnostic
                  </button>
                )}

                {demande.status === 'en cours' && (
                  <Link
                    to={`/technician/diagnostic/${demande.id_demande}`}
                    className="btn-primary w-full py-2 text-center block"
                  >
                    <Wrench className="w-4 h-4 mr-2 inline" />
                    Continuer le diagnostic
                  </Link>
                )}

                <Link
                  to={`/demande/${demande.id_demande}`}
                  className="btn-outline w-full py-2 text-center block"
                >
                  <Eye className="w-4 h-4 mr-2 inline" />
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'Aucune commande trouvée' : 'Aucune commande assignée'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Les demandes de diagnostic vous seront assignées par l\'administrateur'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TechnicianDemandes;
