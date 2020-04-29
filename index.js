const express = require("express");
const router = require("./src/routes");
const path = require('path');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const {exec} = require('child_process');


const dotenv = require('dotenv');

dotenv.config();

require('./src/database');

const app = express();
const run = async () => {
    app.use('*', cors());
    app.use(express.json());
    app.use(router);
    app.use("/", express.static(path.resolve(__dirname, "public")))
    app.use(errorHandler);

    exec('cd bin\\pgsql\\bin\\&&pg_ctl start -D ../data', {}, (error, out, err) =>{
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(out);
        console.error(err);
    })

    app.listen(process.env.PORT || 3333, () => {
        console.log("Server started at port %d", process.env.PORT || 3333);
    });
}

run().catch(console.error)