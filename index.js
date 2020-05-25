const express = require("express");
const router = require("./src/routes");
const path = require('path');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const {spawn} = require('child_process');
const net = require('net');
const os = require("os");
const ip = require('ip');

const portInUse = port => new Promise((res, rej) => {
    try{
        const server = net.createServer(function(socket) {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
        });

        server.listen(port, '127.0.0.1');

        server.on('error', function (e) {
            res(true);
        });

        server.on('listening', function (e) {
            server.close();
            res(false);
        });

    }catch(e) {
        rej(e)
    }
});


const dotenv = require('dotenv');

dotenv.config();

require('./src/database');

const app = express();
const run = async () => {
    try{
        console.log("Intializaing middlewares...")
        app.use('*', cors({origin: '*'}));
        app.use(express.json());
        app.use(router);
        app.use("/", express.static(path.resolve(__dirname, "public")))
        app.use(errorHandler);
        console.log("Done.");

        console.log("Checking database...")

        const inUse = await portInUse(5432);
        if(inUse) console.log('Database instance was already running!');
        else {
            console.log('No database instances running, trying to start a new one...');
            const pgctl = spawn('cmd', ['/c', 'bin\\pgsql\\bin\\pg_ctl', 'start', '-D', '../data'], {shell: false, windowsHide: true})
    
            pgctl.stdout.on('error', function(msg){  
                console.error('Database error! ', msg.toString());
            });
        }

        console.log("Starting server..")
        app.listen(process.env.PORT || 3333, () => {
            console.log("Server started at port %d", process.env.PORT || 3333);
            console.log('Opening dashboard server...');

            const serve = spawn('cmd', ['/c', 'serve', '-s', '-l', '80', 'public'], {shell: false, windowsHide: true});
    
            serve.stdout.on('error', function(msg){  
                console.error('Failed to open connection! ', msg.toString());
            });

            console.log('Success!');
            console.log('IPV4: http://%s', ip.address());
            console.log('COMPUTER: http://%s', os.hostname());
        });
    }catch(e){
        console.error("Failed! reason: ", e.message);
        process.exit(1)
    }
}

run().catch(console.error)