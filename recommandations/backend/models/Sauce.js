// // La base de données MongoDB est fractionnée en collections : le nom de la collection est défini par défaut sur le pluriel du nom du modèle. Ici, ce sera Sauces.

// importation de mongoose
const mongoose = require("mongoose");

// --------------------------Exemple a modifier---------
// creation d'un schema de donnée
const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number, required: false, default: 0 },
	dislikes: { type: Number, required: false, default: 0 },
	usersLiked: { type: [String], required: false },
	usersDisliked: { type: [String], required: false },
});
// exportation du modele ( le type et le schema en argument)
module.exports = mongoose.model("Sauce", sauceSchema);
