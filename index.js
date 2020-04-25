const express = require("express");
const router = require("./src/routes");
const errorHandler = require('./src/middlewares/errorHandler')

require('./src/database');

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(process.env.PORT || 3333, () => {
    console.log("Server started at port %d", process.env.PORT || 3333);
});