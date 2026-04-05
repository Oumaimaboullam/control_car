const express = require('express');
const phpExec = require('php-express')({
  binPath: 'php'
});

const app = express();
const port = 8000;

// Middleware pour PHP
app.all('*', phpExec);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
