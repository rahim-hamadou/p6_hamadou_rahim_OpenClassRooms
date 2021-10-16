// Utilisation: App.js fait appel aux différentes fonctions implémentées dans l'APi : Accès aux images, aux route User, aux route Sauce

// importation de express ( librairie de fonction ) via require
const express = require("express");

// importation de body parser ( qui tranforme le corps de la requete en JSON)
const bodyParser = require("body-parser");

// creation de notre app qui appelle la methode express
const app = express();

// importation de mongoose pour liaison avec la base de données
// plugin Mongoose pour se connecter à la data base Mongo Db
const mongoose = require("mongoose");

// appel de path qui donne acces au chemin de fichier
// Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const path = require("path");

// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
// il sécurise nos requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// et ajoute une protection XSS mineure et protège contre le reniflement de TYPE MIME
// cross-site scripting, sniffing et clickjacking
const helmet = require("helmet");

const nocache = require("nocache");

// importation du routeur sauce
const routeSauce = require("./routes/routeSauce");

// importation du routeur user
const routeUser = require("./routes/routeUser");

// configuration de mongoose avec le compte en ligne
mongoose
	.connect(
		"mongodb+srv://rahimhamadou:spid3rman93@cluster0.kfolo.mongodb.net/P6_hamadou_rahim?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true },
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// creation  d'une exception CORS pour autoriser la lecture de la reponse par le client
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// appel de la methode body parser pour rendre exploitable toutes les requetes en object js utilisable json
app.use(bodyParser.json());

// Sécuriser Express en définissant divers en-têtes HTTP - https://www.npmjs.com/package/helmet#how-it-works
// On utilise helmet pour plusieurs raisons notamment la mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs web
app.use(helmet());

//Désactive la mise en cache du navigateur
app.use(nocache());

//appel du routeur par express

app.use("/api/sauces", routeSauce);
app.use("/api/auth", routeUser);
// permet via express de choisir le dossier source des images via la methode path
app.use("/images", express.static(path.join(__dirname, "images")));

// --------------Export---------------------

// exportation de notre fichier
module.exports = app;
