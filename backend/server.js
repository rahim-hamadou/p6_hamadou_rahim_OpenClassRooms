// Import du package http - https requiert un certificat SSL à obtenir avec un nom de domaine
const http = require("http");
// Importation de l'application sur le server via le fichier app.js
const app = require("./app");

// definir le port de express
app.set("port", process.env.PORT || 3000);

// Créer un serveur avec express qui utilise app
// Création d'une constante pour les appels serveur (requetes et reponses)
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);
