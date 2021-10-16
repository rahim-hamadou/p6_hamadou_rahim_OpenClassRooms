// La base de données MongoDB est fractionnée en collections : le nom de la collection est défini par défaut sur le pluriel du nom du modèle. Ici, ce sera Things.
const mongoose = require("mongoose");

// appel du plugging validator pour securiser l'email
const uniqueValidator = require("mongoose-unique-validator");

// creation d'un schema de donnée
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// on appel le pluggin avant l'export du schema
userSchema.plugin(uniqueValidator);

// Dans notre schéma, la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera qu'aucun des deux utilisateurs ne peut partager la même adresse e-mail.

// exportation du modele Thing ( le type et le schema en argument)
module.exports = mongoose.model("User", userSchema);
