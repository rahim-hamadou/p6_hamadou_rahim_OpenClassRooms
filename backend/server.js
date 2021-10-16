const http = require("http");
// importation de du fichier app.js
const app = require("./app");

// definir le port de express
app.set("port", process.env.PORT || 3000);

const server = http.createServer(app);

server.listen(process.env.PORT || 3000);
