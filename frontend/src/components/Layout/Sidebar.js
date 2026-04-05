import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  Car, 
  Wrench, 
  Bell, 
  LogOut,
  History,
  UserCheck,
  Tags
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const baseItems = [
      { path: `/${user?.role}/dashboard`, label: 'Dashboard', icon: Home },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/admin/demandes', label: 'Commandes', icon: FileText },
        { path: '/admin/clients', label: 'Clients', icon: Users },
        { path: '/admin/techniciens', label: 'Techniciens', icon: UserCheck },
        { path: '/admin/marques-types', label: 'Marques / Types', icon: Tags },
        { path: '/notifications', label: 'Notifications', icon: Bell },
        { path: '/admin/profile', label: 'Profil', icon: Settings },
      ];
    }

    if (user?.role === 'technicien') {
      return [
        ...baseItems,
        { path: '/technician/demandes', label: 'Commandes assignées', icon: FileText },
        { path: '/notifications', label: 'Notifications', icon: Bell },
        { path: '/technician/profile', label: 'Profil', icon: Settings },
      ];
    }

    if (user?.role === 'client') {
      return [
        ...baseItems,
        { path: '/client/demandes', label: 'Mes Demandes', icon: FileText },
        { path: '/client/historique', label: 'Historique', icon: History },
        { path: '/notifications', label: 'Notifications', icon: Bell },
        { path: '/client/profile', label: 'Profil', icon: Settings },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={index}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          
          <button
            onClick={logout}
            className="sidebar-link text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
