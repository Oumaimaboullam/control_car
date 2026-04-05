import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, Clock, MapPin, Phone, Link as LinkIcon } from 'lucide-react';

const CreateDemande = () => {
  const [formData, setFormData] = useState({
    matricule: '',
    adresse: '',
    telephone: '',
    time: '',
    date: '',
    lien: '',
    idtype: '',
    idmarque: ''
  });
  const [types, setTypes] = useState([]);
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    if (formData.idtype) {
      fetchMarques(formData.idtype);
    }
  }, [formData.idtype]);

  const fetchTypes = async () => {
    try {
      const response = await fetch('/api/types');
      const data = await response.json();
      if (data.records) {
        setTypes(data.records);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const fetchMarques = async (typeId) => {
    try {
      const response = await fetch(`/api/marques?idtype=${typeId}`);
      const data = await response.json();
      if (data.records) {
        setMarques(data.records);
      }
    } catch (error) {
      console.error('Error fetching marques:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'idtype') {
      setFormData({
        ...formData,
        [name]: value,
        idmarque: '' // Reset marque when type changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/demandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Demande créée avec succès!');
        setTimeout(() => {
          navigate('/client/demandes');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la création de la demande');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Créer une demande</h1>
        <p className="text-gray-600 mt-2">
          Remplissez le formulaire pour soumettre une demande de diagnostic
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Type and Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de véhicule
              </label>
              <select
                name="idtype"
                value={formData.idtype}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Sélectionnez un type</option>
                {types.map((type) => (
                  <option key={type.idtype} value={type.idtype}>
                    {type.icone} {type.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <select
                name="idmarque"
                value={formData.idmarque}
                onChange={handleChange}
                className="input-field"
                required
                disabled={!formData.idtype}
              >
                <option value="">
                  {formData.idtype ? 'Sélectionnez une marque' : 'Sélectionnez d\'abord un type'}
                </option>
                {marques.map((marque) => (
                  <option key={marque.idmarque} value={marque.idmarque}>
                    {marque.marque}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matricule du véhicule
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="AA-123-BB"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse du diagnostic
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="123 Rue de la République, 75001 Paris"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="0600000000"
                required
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date souhaitée
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field pl-10"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure souhaitée
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Optional Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien vers photos/vidéos (optionnel)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                name="lien"
                value={formData.lien}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="https://exemple.com/photos"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Création...
                </div>
              ) : (
                'Créer la demande'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/client/demandes')}
              className="btn-outline flex-1 py-3"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDemande;
