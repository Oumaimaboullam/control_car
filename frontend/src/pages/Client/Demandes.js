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
  Calendar,
  MapPin
} from 'lucide-react';

const ClientDemandes = () => {
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
      const response = await fetch('/api/demandes?user=true');
      const data = await response.json();
      
      if (data.records) {
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

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(demande => demande.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(demande => 
        demande.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.type.toLowerCase().includes(searchTerm.toLowerCase())
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

  const cancelDemande = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette demande?')) {
      return;
    }

    try {
      const response = await fetch('/api/demandes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_demande: id,
          status: 'annuler',
          iduser: demandes.find(d => d.id_demande === id).iduser
        }),
      });

      if (response.ok) {
        fetchDemandes(); // Refresh the list
      }
    } catch (error) {
      console.error('Error cancelling demande:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
          <p className="text-gray-600 mt-2">
            Suivez l'état de vos demandes de diagnostic
          </p>
        </div>
        <Link to="/client/demandes/create" className="btn-primary">
          Nouvelle demande
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par matricule, marque ou type..."
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

      {/* Demandes List */}
      {filteredDemandes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(demande.status)}
                  <span className="text-sm text-gray-600 capitalize">
                    {demande.status}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/demande/${demande.id_demande}`}
                    className="btn-outline text-sm py-1 px-3"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </Link>
                  
                  {demande.status === 'en attente' && (
                    <button
                      onClick={() => cancelDemande(demande.id_demande)}
                      className="btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white text-sm py-1 px-3"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'Aucune demande trouvée' : 'Aucune demande'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Commencez par créer votre première demande de diagnostic'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link to="/client/demandes/create" className="btn-primary">
              Créer une demande
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientDemandes;
