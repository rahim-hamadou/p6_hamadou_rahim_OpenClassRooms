// appel de bcryp pour crypter les données
// npm install --save bcrypt
const bcrypt = require("bcrypt");

// importation du packet jwt  pour attribuer un token à un utilisateur au moment ou il se connecte
// npm install --save jsonwebtoken
const jwt = require("jsonwebtoken");

// importation du schema Users
// importation du modele d'element User
const User = require("../models/User");

// fonction pour l'enregistrement de nouveau user
exports.signup = (req, res, next) => {
	// on hash le mdp dans le body de la requete
	bcrypt
		// On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
		.hash(req.body.password, 10)
		// On récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD mongoDB
		.then((hash) => {
			const user = new User({
				// On passe l'email qu'on trouve dans le corps de la requête
				email: req.body.email,
				// On récupère le mdp hashé de bcrypt
				password: hash,
			});
			// On enregistre l'utilisateur dans la base de données
			user.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		// Si il existe déjà un utilisateur avec cette adresse email
		.catch((error) => res.status(500).json({ error }));
};

// fonction pour la connexion  d'user qui vérifie si l'utilisateur existe dans la base MongoDB lors du login
//si oui il vérifie son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur
exports.login = (req, res, next) => {
	// recherche via la fonction findOne d'un utilisateur ,ici par rapport a son mail
	User.findOne({ email: req.body.email })
		.then((user) => {
			// Si on trouve pas l'utilisateur on va renvoyer un code 401 "non autorisé"
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				// on compare le mdp entré et celui dans le body de la requete pour savoir si ils ont la même string d'origine
				.compare(req.body.password, user.password)
				.then((valid) => {
					// Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					// Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
					res.status(200).json({
						// Le serveur backend renvoie un token au frontend
						userId: user._id,
						// on va pouvoir obtenir un token encodé pour cette authentification grâce à jsonwebtoken, on va créer des tokens et les vérifier
						token: jwt.sign(
							// .sign permet d'encoder un nouveau token
							{ userId: user._id },
							// encodage avec des caractères secrets
							// Clé d'encodage du token qui peut être rendue plus complexe en production
							"RANDOM_TOKEN_SECRET",
							// Argument de configuration avec une expiration au bout de 24h
							{ expiresIn: "24h" },
						),
					});
				})

				// On encode le userID pour la création de nouveaux objets, et cela permet d'appliquer le bon userID aux objets et ne pas modifier les objets d' autres user
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
