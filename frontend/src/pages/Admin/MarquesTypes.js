import React, { useState, useEffect } from 'react';
import { 
  Tags, 
  Car, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';

const AdminMarquesTypes = () => {
  const [types, setTypes] = useState([]);
  const [marques, setMarques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('types');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    icone: '🚗'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [typesResponse, marquesResponse] = await Promise.all([
        fetch('/api/types'),
        fetch('/api/marques')
      ]);

      const typesData = await typesResponse.json();
      const marquesData = await marquesResponse.json();

      if (typesData.records) setTypes(typesData.records);
      if (marquesData.records) setMarques(marquesData.records);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createType = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ type: '', icone: '🚗' });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating type:', error);
    }
  };

  const createMarque = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/marques', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ type: '', icone: '🚗', idtype: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating marque:', error);
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément?')) {
      return;
    }

    try {
      const response = await fetch(`/api/${type}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const updateItem = async (type, data) => {
    try {
      const response = await fetch(`/api/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEditingItem(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating item:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Marques & Types</h1>
          <p className="text-gray-600 mt-2">
            Gérez le catalogue des véhicules
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setFormData(activeTab === 'types' ? { type: '', icone: '🚗' } : { marque: '', icone: '🚗', idtype: '' });
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter {activeTab === 'types' ? 'un type' : 'une marque'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('types')}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'types'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Types de véhicules ({types.length})
          </button>
          <button
            onClick={() => setActiveTab('marques')}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'marques'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Marques ({marques.length})
          </button>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ajouter {activeTab === 'types' ? 'un type' : 'une marque'} de véhicule
            </h2>
            <form onSubmit={activeTab === 'types' ? createType : createMarque} className="space-y-4">
              {activeTab === 'types' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de véhicule
                    </label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="input-field"
                      placeholder="Ex: Berline, SUV, Sport..."
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de véhicule
                    </label>
                    <select
                      value={formData.idtype}
                      onChange={(e) => setFormData({...formData, idtype: e.target.value})}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <input
                      type="text"
                      value={formData.marque}
                      onChange={(e) => setFormData({...formData, marque: e.target.value})}
                      className="input-field"
                      placeholder="Ex: Renault, BMW, Ferrari..."
                      required
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icône
                </label>
                <input
                  type="text"
                  value={formData.icone}
                  onChange={(e) => setFormData({...formData, icone: e.target.value})}
                  className="input-field"
                  placeholder="🚗"
                />
              </div>
              
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-outline flex-1"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'types' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type) => (
            <div key={type.idtype} className="card">
              {editingItem?.id === type.idtype ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({...editingItem, type: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={editingItem.icone}
                    onChange={(e) => setEditingItem({...editingItem, icone: e.target.value})}
                    className="input-field"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateItem('types', editingItem)}
                      className="btn-primary flex-1"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="btn-outline flex-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{type.icone}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.type}</h3>
                      <p className="text-sm text-gray-600">
                        {marques.filter(m => m.idtype === type.idtype).length} marques
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(type)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem('types', type.idtype)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Marque</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Icône</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {marques.map((marque) => (
                <tr key={marque.idmarque} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <Car className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{marque.marque}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-sm">
                      {marque.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xl">{marque.icone}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItem(marque)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('marques', marque.idmarque)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'types' && types.length === 0) || 
        (activeTab === 'marques' && marques.length === 0)) && (
        <div className="card text-center py-12">
          <Tags className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun {activeTab === 'types' ? 'type' : 'marque'} trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez par ajouter des {activeTab === 'types' ? 'types de véhicules' : 'marques'} au catalogue
          </p>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setFormData(activeTab === 'types' ? { type: '', icone: '🚗' } : { marque: '', icone: '🚗', idtype: '' });
            }}
            className="btn-primary"
          >
            Ajouter {activeTab === 'types' ? 'un type' : 'une marque'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMarquesTypes;
