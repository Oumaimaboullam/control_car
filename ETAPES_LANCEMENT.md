# 🚀 Étapes de Lancement - Control-Car

## Prérequis techniques

- **PHP 8.0+** avec extensions PDO, MySQL, session
- **MySQL 8.0+** 
- **Node.js 16+** et npm
- **Serveur web** (Apache avec mod_rewrite ou Nginx)
- **Navigateur web** moderne (Chrome, Firefox, Safari, Edge)

---

## 📋 ÉTAPE 1: Configuration de la base de données

### 1.1 Démarrer MySQL
```bash
# Windows
net start mysql

# Linux/Mac
sudo systemctl start mysql
```

### 1.2 Importer la base de données
```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE control_car;

# Importer le fichier SQL
mysql -u root -p control_car < database.sql
```

### 1.3 Vérifier l'importation
```sql
USE control_car;
SHOW TABLES;
SELECT COUNT(*) FROM users;  -- Devrait retourner 1 (admin)
SELECT COUNT(*) FROM type_vehicule;  -- Devrait retourner 5
```

---

## 🖥️ ÉTAPE 2: Configuration du serveur web

### 2.1 Avec Apache (recommandé pour le développement)

**Windows (XAMPP/WAMP):**
1. Placez le dossier `backend` dans `htdocs/`
2. Activez `mod_rewrite`
3. Redémarrez Apache

**Linux:**
```bash
# Installer Apache
sudo apt install apache2 libapache2-mod-php

# Activer mod_rewrite
sudo a2enmod rewrite

# Configurer VirtualHost
sudo nano /etc/apache2/sites-available/control-car.conf
```

Contenu du VirtualHost:
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/control_car/backend
    ServerName control-car.local
    
    <Directory /path/to/control_car/backend>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

```bash
# Activer le site
sudo a2ensite control-car.conf
sudo systemctl reload apache2
```

### 2.2 Avec Nginx

```nginx
server {
    listen 80;
    server_name control-car.local;
    root /path/to/control_car/backend;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## ⚙️ ÉTAPE 3: Configuration du Backend PHP

### 3.1 Vérifier la configuration PHP
```bash
# Vérifier la version
php --version

# Vérifier les extensions requises
php -m | grep -E "(pdo|mysql|session)"
```

### 3.2 Configurer la connexion à la base de données
Éditez `backend/config/database.php`:
```php
private $host = 'localhost';
private $db_name = 'control_car';
private $username = 'root';
private $password = 'votre_mot_de_passe_mysql';
```

### 3.3 Vérifier les permissions
```bash
# Linux/Mac
chmod -R 755 backend/
chmod -R 755 backend/uploads/  # Si vous avez un dossier d'uploads

# Windows
# Assurez-vous que IIS/APACHE a les permissions d'écriture
```

---

## 🎨 ÉTAPE 4: Installation du Frontend React

### 4.1 Installer les dépendances
```bash
cd frontend
npm install
```

### 4.2 Vérifier l'installation
```bash
# Vérifier que les modules sont installés
ls node_modules/

# Tester la configuration
npm run build  # Devrait se terminer sans erreur
```

---

## 🚀 ÉTAPE 5: Lancement de l'application

### 5.1 Démarrer le frontend React
```bash
cd frontend
npm start
```

Le frontend sera accessible sur: **http://localhost:3000**

### 5.2 Vérifier que tout fonctionne
1. Ouvrez **http://localhost:3000** dans votre navigateur
2. Vous devriez voir la page de connexion Control-Car

---

## 🔑 ÉTAPE 6: Première connexion

### 6.1 Connexion administrateur
- **Email**: `admin@controlcar.com`
- **Mot de passe**: `password`

### 6.2 Créer un compte client
1. Cliquez sur "S'inscrire"
2. Remplissez le formulaire
3. Connectez-vous avec le nouveau compte

### 6.3 Créer un technicien (via admin)
1. Connectez-vous en tant qu'admin
2. Allez dans "Techniciens"
3. Cliquez sur "Ajouter un technicien"
4. Remplissez les informations

---

## 🧪 ÉTAPE 7: Test des fonctionnalités

### 7.1 Test client
1. ✅ Connexion/Déconnexion
2. ✅ Création d'une demande
3. ✅ Suivi des demandes
4. ✅ Consultation de l'historique

### 7.2 Test technicien
1. ✅ Voir les demandes assignées
2. ✅ Démarrer un diagnostic
3. ✅ Remplir le formulaire de diagnostic

### 7.3 Test administrateur
1. ✅ Tableau de bord statistiques
2. ✅ Gestion des utilisateurs
3. ✅ Gestion des demandes
4. ✅ Création de factures

---

## 🐛 ÉTAPE 8: Dépannage courant

### Problème: Page blanche
```bash
# Vérifier les erreurs PHP
tail -f /var/log/apache2/error.log

# Activer l'affichage des erreurs (temporaire)
# Dans index.php, ajoutez:
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

### Problème: Connexion base de données échoue
```bash
# Tester la connexion MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Vérifier les identifiants dans database.php
```

### Problème: React ne se compile pas
```bash
# Nettoyer et réinstaller
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problème: CORS/Permissions
```bash
# Vérifier que .htaccess est bien pris en compte
# Dans Apache: AllowOverride All doit être configuré
```

---

## 🌐 ÉTAPE 9: Déploiement en production

### 9.1 Configuration production
```bash
# Build du frontend
cd frontend
npm run build

# Copier le build dans le backend
cp -r build/* backend/public/
```

### 9.2 Configuration Apache pour la production
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/control_car/backend/public
    ServerName votre-domaine.com
    
    <Directory /path/to/control_car/backend/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 9.3 Sécurité
```bash
# Changer le mot de passe admin par défaut
# Configurer HTTPS avec SSL
# Restreindre l'accès à la base de données
# Activer le firewall
```

---

## ✅ ÉTAPE 10: Vérification finale

### Checklist de lancement:
- [ ] Base de données importée et accessible
- [ ] Backend PHP répond aux requêtes API
- [ ] Frontend React compile et s'affiche
- [ ] Connexion admin fonctionne
- [ ] Création compte client fonctionne
- [ ] Navigation entre les pages fonctionne
- [ ] Les 3 rôles (admin, client, technicien) sont fonctionnels

### URL d'accès:
- **Application**: http://localhost:3000
- **API Backend**: http://localhost/backend/api
- **Admin**: admin@controlcar.com / password

---

## 🎉 FÉLICITATIONS!

Votre plateforme Control-Car est maintenant opérationnelle! 🚗✨

Pour toute assistance technique, consultez le fichier README.md ou contactez l'équipe de développement.
