import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  Calendar,
  Filter,
  Search
} from 'lucide-react';

const ClientHistorique = () => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchDemandes();
  }, []);

  useEffect(() => {
    filterDemandes();
  }, [demandes, searchTerm, statusFilter, dateFilter]);

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

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case '7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          filterDate.setDate(now.getDate() - 90);
          break;
        case '1year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(demande => new Date(demande.date) >= filterDate);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(demande => 
        demande.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.number.toString().includes(searchTerm)
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

  const exportToCSV = () => {
    const csvContent = [
      ['Numéro', 'Matricule', 'Marque', 'Type', 'Date', 'Heure', 'Statut', 'Adresse'],
      ...filteredDemandes.map(demande => [
        demande.number,
        demande.matricule,
        demande.marque,
        demande.type,
        demande.date,
        demande.time,
        demande.status,
        demande.adresse
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique_demandes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-3xl font-bold text-gray-900">Historique des demandes</h1>
          <p className="text-gray-600 mt-2">
            Consultez l'historique complet de vos demandes de diagnostic
          </p>
        </div>
        {filteredDemandes.length > 0 && (
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Exporter CSV</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
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

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              className="input-field"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Toutes les dates</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
              <option value="1year">Dernière année</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <p className="text-3xl font-bold text-gray-900">{filteredDemandes.length}</p>
          <p className="text-gray-600">Total demandes</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {filteredDemandes.filter(d => d.status === 'en attente').length}
          </p>
          <p className="text-gray-600">En attente</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600">
            {filteredDemandes.filter(d => d.status === 'en cours').length}
          </p>
          <p className="text-gray-600">En cours</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">
            {filteredDemandes.filter(d => d.status === 'terminer').length}
          </p>
          <p className="text-gray-600">Terminées</p>
        </div>
      </div>

      {/* Demandes Table */}
      {filteredDemandes.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Numéro</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Véhicule</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemandes.map((demande) => (
                <tr key={demande.id_demande} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium">#{demande.number}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{demande.marque} {demande.type}</p>
                      <p className="text-sm text-gray-600">{demande.matricule}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm">{new Date(demande.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-600">{demande.time}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(demande.status)}
                      <span className={`status-badge ${getStatusClass(demande.status)}`}>
                        {demande.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/demande/${demande.id_demande}`}
                        className="btn-outline text-sm py-1 px-3"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
              ? 'Aucune demande trouvée' 
              : 'Aucune demande dans l\'historique'
            }
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Votre historique de demandes apparaîtra ici'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientHistorique;
