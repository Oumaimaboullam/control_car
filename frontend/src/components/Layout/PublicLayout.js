import React from 'react';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Control-Car</h1>
          <p className="text-gray-600">Plateforme de Contrôle & Diagnostic de Véhicules</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PublicLayout;
