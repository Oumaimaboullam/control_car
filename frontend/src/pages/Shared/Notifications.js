import React, { useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, Check, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (text) => {
    if (text.includes('acceptée') || text.includes('accepter')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (text.includes('refusée') || text.includes('refuser')) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    if (text.includes('en cours')) {
      return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
    if (text.includes('terminée') || text.includes('terminé')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <Bell className="w-5 h-5 text-gray-600" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? 'À l\'instant' : `Il y a ${diffMinutes} minutes`;
      }
      return diffHours === 1 ? 'Il y a 1 heure' : `Il y a ${diffHours} heures`;
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn-outline flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Tout marquer comme lu</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id_notif}
              className={`card p-4 transition-all ${
                notification.is_read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-primary shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.text)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-gray-900 ${
                      notification.is_read ? 'font-normal' : 'font-semibold'
                    }`}>
                      {notification.text}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(notification.date)}</span>
                      </span>
                      {notification.matricule && (
                        <span className="flex items-center space-x-1">
                          <span>•</span>
                          <span>Véhicule: {notification.matricule}</span>
                        </span>
                      )}
                      {notification.status && (
                        <span className={`status-badge status-${notification.status.replace(' ', '-')}`}>
                          {notification.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id_notif)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune notification
          </h3>
          <p className="text-gray-600">
            Vous n'avez aucune notification pour le moment.
            Les nouvelles notifications apparaîtront ici.
          </p>
        </div>
      )}

      {/* Statistics */}
      {notifications.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Résumé des notifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-gray-600">Total notifications</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">
                {notifications.filter(n => !n.is_read).length}
              </p>
              <p className="text-gray-600">Non lues</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.is_read).length}
              </p>
              <p className="text-gray-600">Déjà lues</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
