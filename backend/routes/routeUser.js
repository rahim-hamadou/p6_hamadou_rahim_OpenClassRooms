// appel de express
const express = require("express");

// creation du router via la methode express
const router = express.Router();

// importation du controller
const ctrlUser = require("../controllers/ctrlUser");

// ------------ROUTES----------------

// route pour l'enregistrement d'user
router.post("/signup", ctrlUser.signup);

// route pour la connexion d'user
router.post("/login", ctrlUser.login);

// ------------EXPORT----------------
// export du routeur
module.exports = router;
