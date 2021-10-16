// importation de express ( librairie de fonction ) via require
const express = require("express");

// importation de body parser ( qui tranforme le corps de la requete en JSON)
const bodyParser = require("body-parser");

// creation de notre app qui appelle la methode express
const app = express();

// importation de mongoose pour liaison avec la base de données
const mongoose = require("mongoose");

// appel de path qui donne acces au chemin de fichier
const path = require("path");

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

//appel du routeur par express

app.use("/api/sauces", routeSauce);
app.use("/api/auth", routeUser);
// permet via express de choisir le dossier source des images via la methode path
app.use("/images", express.static(path.join(__dirname, "images")));

// --------------Export---------------------

// exportation de notre fichier
module.exports = app;
