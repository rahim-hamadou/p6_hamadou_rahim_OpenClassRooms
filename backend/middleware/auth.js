// appel de notre packet jsonwebtoken
const jwt = require("jsonwebtoken");

// export du fichier
module.exports = (req, res, next) => {
	try {
		// recuperation du token via sa forme via le split
		const token = req.headers.authorization.split(" ")[1];
		// decoder le token
		const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
		// recuperation du userID
		const userID = decodedToken.userID;
		// condition d'authorisation
		if (req.body.userID && req.body.userID !== userID) {
			throw "User ID non valable !";
		} else {
			next();
		}
	} catch (error) {
		res.status(401).json({ error: error | "Requete non authentifiée" });
	}
};
