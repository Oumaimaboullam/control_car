# Control-Car - Plateforme de Contrôle & Diagnostic de Véhicules

## Description

Control-Car est une plateforme web professionnelle dédiée au contrôle et au diagnostic de véhicules d'occasion. Elle met en relation des clients souhaitant faire expertiser un véhicule avec des techniciens qualifiés, le tout supervisé par un administrateur central.

## Architecture

- **Backend**: PHP avec pattern MVC, API REST
- **Frontend**: React.js avec Tailwind CSS
- **Base de données**: MySQL
- **Authentification**: Sessions PHP + localStorage

## Fonctionnalités

### 🎯 Acteurs du système

**Client**
- Création et suivi des demandes de diagnostic
- Consultation des rapports et factures
- Gestion du profil personnel

**Technicien**
- Consultation des demandes assignées
- Réalisation des diagnostics complets
- Upload d'images pour les éléments défectueux

**Administrateur**
- Gestion complète des utilisateurs
- Supervision des demandes
- Création des factures
- Gestion du catalogue véhicules

### 🔧 Modules principaux

- **Authentification**: Sécurisée avec bcrypt et middleware
- **Gestion des demandes**: Cycle de vie complet (En attente → En cours → Terminée)
- **Diagnostic**: Formulaire détaillé en 4 sections (Extérieur, Intérieur, Mécanique, Test)
- **Facturation**: Génération automatique des factures
- **Notifications**: Système en temps réel
- **Catalogue véhicules**: Gestion des types et marques

## Installation

### Prérequis

- PHP 8.0+
- MySQL 8.0+
- Node.js 16+
- Apache/Nginx avec mod_rewrite

### 1. Base de données

```sql
# Importer le fichier SQL
mysql -u root -p control_car < database.sql
```

### 2. Backend (PHP)

```bash
# Configurer Apache pour pointer vers /backend
# Activer mod_rewrite
a2enmod rewrite

# Configurer les permissions
chmod -R 755 backend/
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

### 4. Configuration

**Backend** - Modifier `backend/config/database.php`:
```php
private $host = 'localhost';
private $db_name = 'control_car';
private $username = 'root';
private $password = ''; // Votre mot de passe MySQL
```

**Frontend** - Le proxy est déjà configuré dans `package.json`:
```json
"proxy": "http://localhost/backend"
```

## Lancement du projet

### Étape 1: Démarrer le serveur web (Apache/Nginx)

```bash
# Pour Apache sur Ubuntu/Debian
sudo systemctl start apache2
sudo systemctl enable apache2

# Pour Nginx sur Ubuntu/Debian  
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Étape 2: Démarrer le serveur MySQL

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Étape 3: Démarrer le frontend React

```bash
cd frontend
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

### Étape 4: Accéder à l'application

- **URL**: http://localhost:3000
- **Admin**: admin@controlcar.com / password
- **Client**: Créer un compte via le formulaire d'inscription
- **Technicien**: Créé par l'administrateur

## Structure des fichiers

```
control_car/
├── backend/
│   ├── config/
│   │   ├── database.php
│   │   └── cors.php
│   ├── controllers/
│   │   ├── AuthController.php
│   │   ├── UserController.php
│   │   ├── DemandeController.php
│   │   ├── DiagnosticController.php
│   │   ├── TypeVehiculeController.php
│   │   ├── MarqueVehiculeController.php
│   │   ├── NotificationController.php
│   │   └── FactureController.php
│   ├── middleware/
│   │   └── AuthMiddleware.php
│   ├── models/
│   │   ├── User.php
│   │   ├── Demande.php
│   │   ├── Diagnostic.php
│   │   ├── TypeVehicule.php
│   │   ├── MarqueVehicule.php
│   │   ├── Notification.php
│   │   └── Facture.php
│   ├── index.php
│   └── .htaccess
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── database.sql
└── README.md
```

## API REST

### Authentification
- `POST /api/auth/register` - Inscription client
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/current` - Utilisateur actuel

### Demandes
- `GET /api/demandes` - Liste des demandes
- `POST /api/demandes` - Créer une demande
- `GET /api/demandes/{id}` - Détails d'une demande
- `PUT /api/demandes` - Mettre à jour le statut

### Diagnostics
- `POST /api/diagnostics` - Créer un diagnostic
- `GET /api/diagnostics/{id}` - Détails d'un diagnostic

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (admin)
- `PUT /api/users` - Mettre à jour un utilisateur
- `PATCH /api/users` - Activer/désactiver un compte

## Sécurité

- **Mots de passe**: Hachage avec bcrypt
- **Sessions**: PHP côté serveur
- **Middleware**: Protection des routes par rôle
- **Validation**: Input validation côté backend
- **SQL Injection**: Utilisation de PDO avec requêtes préparées

## Charte graphique

- **Couleur primaire**: Rouge (#C0392B)
- **Couleur secondaire**: Noir (#1A1A2E)
- **Couleur neutre**: Blanc (#FFFFFF)
- **Style**: Moderne & minimaliste
- **Responsive**: Mobile, tablette, desktop

## Support

Pour toute question ou problème technique, veuillez contacter l'équipe de développement.

---

**Control-Car** © 2026 - Tous droits réservés
