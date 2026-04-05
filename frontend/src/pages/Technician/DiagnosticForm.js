import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Car, 
  Camera, 
  CheckCircle, 
  XCircle,
  Save,
  AlertTriangle,
  Upload
} from 'lucide-react';

const DiagnosticForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    // Extérieur
    apparence_exterieure: 1,
    apparence_exterieure_image: '',
    carrosserie: 1,
    carrosserie_image: '',
    pneu_av_gauche: 1,
    pneu_av_gauche_image: '',
    pneu_av_droit: 1,
    pneu_av_droit_image: '',
    pneu_ar_droit: 1,
    pneu_ar_droit_image: '',
    pneu_ar_gauche: 1,
    pneu_ar_gauche_image: '',
    roue_secours: 1,
    roue_secours_image: '',
    phare_ar_droit: 1,
    phare_ar_droit_image: '',
    phare_ar_gauche: 1,
    phare_ar_gauche_image: '',
    phare_av_gauche: 1,
    phare_av_gauche_image: '',
    phare_av_droit: 1,
    phare_av_droit_image: '',
    clignotants: 1,
    clignotants_image: '',
    ampoules: 1,
    ampoules_image: '',
    essuie_glaces: 1,
    essuie_glaces_image: '',
    conforme_exterieur: 1,

    // Intérieur
    apparence_interieur: 1,
    apparence_interieur_image: '',
    habitacle: 1,
    habitacle_image: '',
    tableau_bord: 1,
    tableau_bord_image: '',
    voyants: 1,
    voyants_image: '',
    compteur: 1,
    compteur_image: '',
    airbags: 1,
    airbags_image: '',
    ceintures: 1,
    ceintures_image: '',
    vitres: 1,
    vitres_image: '',
    retroviseurs: 1,
    retroviseurs_image: '',
    conforme_interieur: 1,

    // Mécanique
    bloc_moteur: 1,
    bloc_moteur_image: '',
    transmission: 1,
    transmission_image: '',
    echappement: 1,
    echappement_image: '',
    demi_train_av_droit: 1,
    demi_train_av_droit_image: '',
    demi_train_av_gauche: 1,
    demi_train_av_gauche_image: '',
    demi_train_ar_droit: 1,
    demi_train_ar_droit_image: '',
    demi_train_ar_gauche: 1,
    demi_train_ar_gauche_image: '',
    conforme_mecanique: 1,

    // Test véhicule
    suspension: 1,
    suspension_image: '',
    direction: 1,
    direction_image: '',
    fumee: 'normale',
    bruit_moteur: 1,
    bruit_moteur_image: '',
    dommages_image: '',
    status: 'Favorable'
  });

  useEffect(() => {
    if (id) {
      fetchDemande();
    }
  }, [id]);

  const fetchDemande = async () => {
    try {
      const response = await fetch(`/api/demandes?id=${id}`);
      const data = await response.json();

      if (data) {
        setDemande(data);
      } else {
        setError('Demande non trouvée');
      }
    } catch (error) {
      setError('Erreur lors du chargement de la demande');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      // En réalité, vous devriez uploader l'image vers un serveur
      // Pour l'instant, nous simulons avec une URL
      const imageUrl = URL.createObjectURL(file);
      handleInputChange(field, imageUrl);
    }
  };

  const calculateConformity = () => {
    // Calculer la conformité pour chaque section
    const exterieurFields = [
      'apparence_exterieure', 'carrosserie', 'pneu_av_gauche', 'pneu_av_droit',
      'pneu_ar_droit', 'pneu_ar_gauche', 'roue_secours', 'phare_ar_droit',
      'phare_ar_gauche', 'phare_av_gauche', 'phare_av_droit', 'clignotants',
      'ampoules', 'essuie_glaces'
    ];

    const interieurFields = [
      'apparence_interieur', 'habitacle', 'tableau_bord', 'voyants',
      'compteur', 'airbags', 'ceintures', 'vitres', 'retroviseurs'
    ];

    const mecaniqueFields = [
      'bloc_moteur', 'transmission', 'echappement', 'demi_train_av_droit',
      'demi_train_av_gauche', 'demi_train_ar_droit', 'demi_train_ar_gauche'
    ];

    const exterieurOk = exterieurFields.every(field => formData[field] === 1);
    const interieurOk = interieurFields.every(field => formData[field] === 1);
    const mecaniqueOk = mecaniqueFields.every(field => formData[field] === 1);

    setFormData(prev => ({
      ...prev,
      conforme_exterieur: exterieurOk ? 1 : 0,
      conforme_interieur: interieurOk ? 1 : 0,
      conforme_mecanique: mecaniqueOk ? 1 : 0,
      status: exterieurOk && interieurOk && mecaniqueOk ? 'Favorable' : 'Défavorable'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_demande: id,
          ...formData
        }),
      });

      if (response.ok) {
        setSuccess('Diagnostic enregistré avec succès!');
        setTimeout(() => {
          navigate('/technician/demandes');
        }, 2000);
      } else {
        setError('Erreur lors de l\'enregistrement du diagnostic');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !demande) {
    return (
      <div className="card text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Formulaire de diagnostic</h1>
        <p className="text-gray-600 mt-2">
          {demande && `Diagnostic pour ${demande.marque} ${demande.type} - ${demande.matricule}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Extérieur Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Car className="w-6 h-6 text-primary mr-2" />
            Extérieur
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { field: 'apparence_exterieure', label: 'Apparence extérieure' },
              { field: 'carrosserie', label: 'Carrosserie' },
              { field: 'pneu_av_gauche', label: 'Pneu avant gauche' },
              { field: 'pneu_av_droit', label: 'Pneu avant droit' },
              { field: 'pneu_ar_droit', label: 'Pneu arrière droit' },
              { field: 'pneu_ar_gauche', label: 'Pneu arrière gauche' },
              { field: 'roue_secours', label: 'Roue de secours' },
              { field: 'phare_ar_droit', label: 'Phare arrière droit' },
              { field: 'phare_ar_gauche', label: 'Phare arrière gauche' },
              { field: 'phare_av_gauche', label: 'Phare avant gauche' },
              { field: 'phare_av_droit', label: 'Phare avant droit' },
              { field: 'clignotants', label: 'Clignotants' },
              { field: 'ampoules', label: 'Ampoules' },
              { field: 'essuie_glaces', label: 'Essuie-glaces' }
            ].map((item) => (
              <div key={item.field} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {item.label}
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange(item.field, 1)}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                      formData[item.field] === 1
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Bon état
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange(item.field, 0)}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                      formData[item.field] === 0
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Mauvais état
                  </button>
                </div>
                {formData[item.field] === 0 && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Photo obligatoire
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(`${item.field}_image`, e)}
                        className="hidden"
                        id={`${item.field}_image_input`}
                      />
                      <label
                        htmlFor={`${item.field}_image_input`}
                        className="flex items-center justify-center w-full py-2 px-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {formData[`${item.field}_image`] ? 'Changer la photo' : 'Ajouter une photo'}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Intérieur Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Intérieur</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { field: 'apparence_interieur', label: 'Apparence intérieur' },
              { field: 'habitacle', label: 'Habitacle' },
              { field: 'tableau_bord', label: 'Tableau de bord' },
              { field: 'voyants', label: 'Voyants' },
              { field: 'compteur', label: 'Compteur' },
              { field: 'airbags', label: 'Airbags' },
              { field: 'ceintures', label: 'Ceintures' },
              { field: 'vitres', label: 'Vitres' },
              { field: 'retroviseurs', label: 'Rétroviseurs' }
            ].map((item) => (
              <div key={item.field} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {item.label}
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange(item.field, 1)}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                      formData[item.field] === 1
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Bon état
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange(item.field, 0)}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                      formData[item.field] === 0
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Mauvais état
                  </button>
                </div>
                {formData[item.field] === 0 && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Photo obligatoire
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(`${item.field}_image`, e)}
                        className="hidden"
                        id={`${item.field}_image_input`}
                      />
                      <label
                        htmlFor={`${item.field}_image_input`}
                        className="flex items-center justify-center w-full py-2 px-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {formData[`${item.field}_image`] ? 'Changer la photo' : 'Ajouter une photo'}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mécanique Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Mécanique</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { field: 'bloc_moteur', label: 'Bloc moteur' },
              { field: 'transmission', label: 'Transmission' },
              { field: 'echappement', label: 'Échappement' },
              { field: 'demi_train_av_droit', label: 'Demi-train avant droit' },
              { field: 'demi_train_av_gauche', label: 'Demi-train avant gauche' },
              { field: 'demi_train_ar_droit', label: 'Demi-train arrière droit' },
              { field: 'demi_train_ar_gauche', label: 'Demi-train arrière gauche' }
            ].map((item) => (
              <div key={item.field} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {item.label}
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange(item.field, 1)}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                      formData[item.field] === 1
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Bon état
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange(item.field, 0)}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                      formData[item.field] === 0
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Mauvais état
                  </button>
                </div>
                {formData[item.field] === 0 && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Photo obligatoire
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(`${item.field}_image`, e)}
                        className="hidden"
                        id={`${item.field}_image_input`}
                      />
                      <label
                        htmlFor={`${item.field}_image_input`}
                        className="flex items-center justify-center w-full py-2 px-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {formData[`${item.field}_image`] ? 'Changer la photo' : 'Ajouter une photo'}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Test véhicule Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Test véhicule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { field: 'suspension', label: 'Suspension' },
                { field: 'direction', label: 'Direction' },
                { field: 'bruit_moteur', label: 'Bruit moteur' }
              ].map((item) => (
                <div key={item.field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {item.label}
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange(item.field, 1)}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                        formData[item.field] === 1
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Bon état
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange(item.field, 0)}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-colors ${
                        formData[item.field] === 0
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Mauvais état
                    </button>
                  </div>
                  {formData[item.field] === 0 && (
                    <div className="mt-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Photo obligatoire
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(`${item.field}_image`, e)}
                          className="hidden"
                          id={`${item.field}_image_input`}
                        />
                        <label
                          htmlFor={`${item.field}_image_input`}
                          className="flex items-center justify-center w-full py-2 px-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {formData[`${item.field}_image`] ? 'Changer la photo' : 'Ajouter une photo'}
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur des fumées
                </label>
                <select
                  value={formData.fumee}
                  onChange={(e) => handleInputChange('fumee', e.target.value)}
                  className="input-field"
                >
                  <option value="normale">Normale</option>
                  <option value="blanche">Blanche</option>
                  <option value="noire">Noire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos des dommages (optionnel)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('dommages_image', e)}
                    className="hidden"
                    id="dommages_image_input"
                  />
                  <label
                    htmlFor="dommages_image_input"
                    className="flex items-center justify-center w-full py-2 px-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {formData.dommages_image ? 'Changer la photo' : 'Ajouter une photo des dommages'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enregistrement...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Save className="w-5 h-5 mr-2" />
                Enregistrer le diagnostic
              </div>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => calculateConformity()}
            className="btn-outline"
          >
            Calculer la conformité
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiagnosticForm;
