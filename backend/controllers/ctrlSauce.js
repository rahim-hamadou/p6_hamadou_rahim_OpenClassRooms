// On prend toute la logique métier pour la déporter dans le fichier ctrlSauce.js de controllers
// On ne garde que la logique de routing dans le fichier routeSauce.js du router. On importe aussi le model Sauce

// importation du schema
// importation du modele d'element sauce
const Sauce = require("../models/Sauce");

// importer le package file systeme pour manupuler les fichier
// fs signifie « file system » (soit « système de fichiers » en français). Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require("fs");

// export de la  fonction  create (POST)
exports.createSauce = (req, res, next) => {
	// creation d'un object representant la reponse qui est une chaine de caractere
	const sauceObject = JSON.parse(req.body.sauce);
	// suppression de l'id precedent
	delete sauceObject._id;
	// construction d'un objet sur base du modele et du body envoyé
	const sauce = new Sauce({
		...sauceObject,
		// On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});
	sauce
		.save()
		.then(() =>
			res.status(201).json({
				message: "Sauce enregistrée ! ",
			}),
		)
		.catch((error) => res.status(400).json({ error }));
};

// Permet de "liker"ou "dislaker" une sauce
// // Définit le statut "j'aime" pour userID fourni. Si j'aime = 1,l'utilisateur aime la sauce. Si j'aime = 0,l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. Si j'aime =-1, l'utilisateur n'aime pas la sauce.L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, engardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
exports.likeDislike = (req, res, next) => {
	// Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
	// Like présent dans le body
	let like = req.body.like;
	// On prend le userID
	let userId = req.body.userId;
	// On prend l'id de la sauce
	let sauceId = req.params.id;

	if (like === 1) {
		// Si il s'agit d'un like
		Sauce.updateOne(
			{
				_id: sauceId,
			},
			{
				// On push l'utilisateur et on incrémente le compteur de 1
				$push: {
					usersLiked: userId,
				},
				$inc: {
					likes: +1,
				}, // On incrémente de 1
			},
		)
			.then(() =>
				res.status(200).json({
					message: "j'aime ajouté !",
				}),
			)
			.catch((error) =>
				res.status(400).json({
					error,
				}),
			);
	}
	if (like === -1) {
		Sauce.updateOne(
			// S'il s'agit d'un dislike
			{
				_id: sauceId,
			},
			{
				$push: {
					usersDisliked: userId,
				},
				$inc: {
					dislikes: +1,
				}, // On incrémente de 1
			},
		)
			.then(() => {
				res.status(200).json({
					message: "Dislike ajouté !",
				});
			})
			.catch((error) =>
				res.status(400).json({
					error,
				}),
			);
	}
	if (like === 0) {
		// Si il s'agit d'annuler un like ou un dislike
		Sauce.findOne({
			_id: sauceId,
		})
			.then((sauce) => {
				if (sauce.usersLiked.includes(userId)) {
					// Si il s'agit d'annuler un like
					Sauce.updateOne(
						{
							_id: sauceId,
						},
						{
							$pull: {
								usersLiked: userId,
							},
							$inc: {
								likes: -1,
							}, // On incrémente de -1
						},
					)
						.then(() =>
							res.status(200).json({
								message: "Like retiré !",
							}),
						)
						.catch((error) =>
							res.status(400).json({
								error,
							}),
						);
				}
				if (sauce.usersDisliked.includes(userId)) {
					// Si il s'agit d'annuler un dislike
					Sauce.updateOne(
						{
							_id: sauceId,
						},
						{
							$pull: {
								usersDisliked: userId,
							},
							$inc: {
								dislikes: -1,
							}, // On incrémente de -1
						},
					)
						.then(() =>
							res.status(200).json({
								message: "Dislike retiré !",
							}),
						)
						.catch((error) =>
							res.status(400).json({
								error,
							}),
						);
				}
			})
			.catch((error) =>
				res.status(404).json({
					error,
				}),
			);
	}
};

// export de la fonction modifier
// Ci-dessus, nous exploitons la méthode updateOne() dans notre modèle Sauce . Cela nous permet de mettre à jour le Sauce qui correspond à l'objet que nous passons comme premier argument. Nous utilisons aussi le paramètre id passé dans la demande et le remplaçons par le Sauce passé comme second argument.
exports.modifySauce = (req, res, next) => {
	// on cree un object avec la req
	const sauceObject = req.file
		? {
				// on transforme en objet
				...JSON.parse(req.body.sauce),
				// on prends la nouvelle image
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Sauce mis a jour" }))
		.catch((error) => res.status(400).json({ error }));
};
// export de la route pour supprimer
// Supprime la sauce avec l'ID fourni.
exports.deleteSauce = (req, res, next) => {
	// on cherche l'objet dans la base de donnée
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// on extrait le nom du fichier a supprimer
			const filename = sauce.imageUrl.split("/images/")[1];
			// on supprime avec fs.unlink
			fs.unlink(`images/${filename}`, () => {
				// suppresion de l'objet dans la base de donnée
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Objet supprimé !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// export de la fonction de recuperation d'un element
// // Renvoie la sauce avec l'ID fourni
exports.getOneSauce = (req, res, next) => {
	// nous utilisons ensuite la méthode findOne() dans notre modèle Thing pour trouver le Sauce unique ayant le même _id que le paramètre de la requête ;
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};
// export de la fonction de recuperation global
// Renvoie le tableau de toutes les sauces dans la base de données
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};
