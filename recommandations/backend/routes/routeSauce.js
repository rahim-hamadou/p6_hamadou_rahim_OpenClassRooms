// appel de express
const express = require("express");

// creation du router via la methode express
const router = express.Router();

// importation du controller
const ctrlSauce = require("../controllers/ctrlSauce");

// importation du middleware d'authentification
const auth = require("../middleware/auth");

// importatation du middleware multer
const multer = require("../middleware/multer-config");

// -----------------------------ROUTES----------------------------

// traitement des methodes post ( pas de next en fin de middleware),  ajout du body sous forme d'objet sauce vers la base de donnée. prevoir en fin l'envoie dune reponse et une solution en cas d'erreur
router.post("/", auth, multer, ctrlSauce.createSauce);

// traitement des methodes post LIKE
router.post("/:id/like", auth, ctrlSauce.likeDislike);

// // traitement des methodes post DISLIKE
// router.put("/:id/dislike", auth, ctrlSauce.dislikeSauce);

// modification d'un element dans la base de donnée
router.put("/:id", auth, multer, ctrlSauce.modifySauce);

// suppression d'un element de la base de donnée
router.delete("/:id", auth, ctrlSauce.deleteSauce);

// ajout d'une route par l'appel GET individuel

router.get("/:id", auth, ctrlSauce.getOneSauce);

// ajout d'une route par l'appel GET global
router.get("/", auth, ctrlSauce.getAllSauce);
// -----------------------------EXPORT----------------------------

// export du routeur
module.exports = router;
