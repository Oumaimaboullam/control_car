import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Car,
  Download,
  Eye,
  ArrowLeft
} from 'lucide-react';

const DemandDetail = () => {
  const { id } = useParams();
  const [demande, setDemande] = useState(null);
  const [diagnostic, setDiagnostic] = useState(null);
  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchDemandeDetail();
    }
  }, [id]);

  const fetchDemandeDetail = async () => {
    try {
      // Fetch demande details
      const demandeResponse = await fetch(`/api/demandes?id=${id}`);
      const demandeData = await demandeResponse.json();

      if (demandeData) {
        setDemande(demandeData);

        // Fetch diagnostic if exists
        try {
          const diagnosticResponse = await fetch(`/api/diagnostics?id=${id}`);
          const diagnosticData = await diagnosticResponse.json();
          if (diagnosticData.id) {
            setDiagnostic(diagnosticData);
          }
        } catch (error) {
          // Diagnostic might not exist yet
        }

        // Fetch facture if exists
        try {
          const factureResponse = await fetch(`/api/factures?id_demande=${id}`);
          const factureData = await factureResponse.json();
          if (factureData.idfacture) {
            setFacture(factureData);
          }
        } catch (error) {
          // Facture might not exist yet
        }
      }
    } catch (error) {
      setError('Erreur lors du chargement des détails de la demande');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en attente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'en cours':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'terminer':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'annuler':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
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

  if (error || !demande) {
    return (
      <div className="card text-center py-12">
        <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
        <p className="text-gray-600">{error || 'Demande non trouvée'}</p>
        <Link to="/client/demandes" className="btn-primary mt-4 inline-block">
          Retour aux demandes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/client/demandes" 
          className="btn-outline flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Détails de la demande</h1>
          <p className="text-gray-600 mt-2">
            Consultez toutes les informations de cette demande
          </p>
        </div>
      </div>

      {/* Main Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Information */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Car className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Informations véhicule</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Marque et type</label>
                <p className="text-lg font-semibold text-gray-900">
                  {demande.marque} {demande.type}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Matricule</label>
                <p className="text-lg font-semibold text-gray-900">{demande.matricule}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Numéro de demande</label>
                <p className="text-lg font-semibold text-gray-900">#{demande.number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Statut</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(demande.status)}
                  <span className={`status-badge ${getStatusClass(demande.status)}`}>
                    {demande.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Rendez-vous</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <p className="text-lg font-semibold text-gray-900">{demande.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Heure</label>
                <p className="text-lg font-semibold text-gray-900">{demande.time}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Adresse</label>
                <p className="text-lg font-semibold text-gray-900">{demande.adresse}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Informations client</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nom complet</label>
                <p className="text-lg font-semibold text-gray-900">
                  {demande.client_nom} {demande.client_prenom}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-900">{demande.client_email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Téléphone</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-900">{demande.telephone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Results */}
          {diagnostic && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">Résultats du diagnostic</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Extérieur</p>
                    <p className="text-lg font-semibold">
                      {diagnostic.conforme_exterieur ? '✅ Conforme' : '❌ Non conforme'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Intérieur</p>
                    <p className="text-lg font-semibold">
                      {diagnostic.conforme_interieur ? '✅ Conforme' : '❌ Non conforme'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Mécanique</p>
                    <p className="text-lg font-semibold">
                      {diagnostic.conforme_mecanique ? '✅ Conforme' : '❌ Non conforme'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Résultat final</p>
                  <p className={`text-xl font-bold ${
                    diagnostic.status === 'Favorable' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {diagnostic.status}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Invoice */}
          {facture && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Download className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-gray-900">Facture</h2>
                </div>
                <button className="btn-outline flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Télécharger</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Numéro de facture</label>
                  <p className="text-lg font-semibold text-gray-900">#{facture.idfacture}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Montant</label>
                  <p className="text-lg font-semibold text-gray-900">{facture.prix} €</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Demande créée</p>
                  <p className="text-xs text-gray-600">{new Date(demande.create_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              
              {demande.status !== 'en attente' && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">En cours de traitement</p>
                    <p className="text-xs text-gray-600">En cours</p>
                  </div>
                </div>
              )}
              
              {demande.status === 'terminer' && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Diagnostic terminé</p>
                    <p className="text-xs text-gray-600">Terminé</p>
                  </div>
                </div>
              )}
              
              {demande.status === 'annuler' && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Demande annulée</p>
                    <p className="text-xs text-gray-600">Annulé</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Links */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-2">
              {demande.lien && (
                <a
                  href={demande.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full text-center block"
                >
                  Voir les photos/vidéos
                </a>
              )}
              
              {diagnostic && (
                <Link
                  to={`/diagnostic/${diagnostic.id}`}
                  className="btn-primary w-full text-center block"
                >
                  Voir le diagnostic complet
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandDetail;
