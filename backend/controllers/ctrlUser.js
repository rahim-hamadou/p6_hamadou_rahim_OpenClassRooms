// appel de bcryp pour crypter les données
// npm install --save bcrypt
const bcrypt = require("bcrypt");

// importation du packet jwt
// npm install --save jsonwebtoken
const jwt = require("jsonwebtoken");

// importation du schema Users
// importation du modele d'element User
const User = require("../models/User");

// fontion pour l'enregistrement de nouveau user
exports.signup = (req, res, next) => {
	// on hash le mdp dans le body de la requete
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// fontion pour la connexion  d'user
exports.login = (req, res, next) => {
	// recherche via la fonction findOne d'un utilisateur ,ici par rapport a son mail
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				// on compare le mdp entré et celui dans le body de la requete
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,

						token: jwt.sign(
							// .sign permet d'encoder un nouveau token
							{ userId: user._id },
							// encodage avec des caractères secrets
							"RANDOM_TOKEN_SECRET",
							{ expiresIn: "24h" },
						),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
