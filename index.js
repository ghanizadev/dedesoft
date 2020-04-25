const express = require("express");
const router = require("./routes");

const app = express();

app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 3333, () => {
    console.log("Server started at port %d", process.env.PORT || 3333);
});