const express = require("express");
const router = require("./src/routes/index.js");
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const {spawn} = require('child_process');
const net = require('net');
const os = require("os");
const ip = require('ip');
const {runMigrations, connection} = require('./src/database');
const handler = require('serve-handler');
const http = require('http');
;

connection;

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

const app = express();
const run = async () => {
    try{
        console.log("Intializing middlewares...")
        app.use('*', cors({origin: '*'}));
        app.use(express.json());
        app.use(router);
        app.use("/", express.static(path.resolve(__dirname, "public")))
        app.use(errorHandler);
        console.log("Done.");

        const openConnection = () => {
            console.log("Starting server..")
                    app.listen(process.env.PORT || 3333, () => {
                        console.log("Server started at port %d", process.env.PORT || 3333);
                        console.log('Opening dashboard server...');

                        const server = http.createServer((request, response) => {
                            return handler(
                                request,
                                response,
                                {
                                    public: './public',
                                    rewrites: [
                                        { "source": "/**", "destination": "/index.html" }
                                    ]
                                }
                            );
                          })
                          
                          server.listen(80, () => {
                            console.log('Success!');
                            console.log('IPV4: http://%s', ip.address());
                            console.log('COMPUTER: http://%s', os.hostname());
                          })

                        

                    });
        }

        console.log("Checking database...");

        const file = path.resolve(process.env.APPDATA, "ghanizadev", "data", "postgresql.conf");

        try {
            if (fs.existsSync(file)) {
                console.log("Done.");
                console.log("Trying to start database...");

                const inUse = await portInUse(5432);
                if(inUse) {
                    console.log('Database instance was already running!');
                    openConnection();
                }
                else {
                    console.log('No database instances running, trying to start a new one...');
                    const pgctl = spawn('cmd', ['/c', 'pg\\bin\\pg_ctl', 'start', '-D', '%appdata%/ghanizadev/data'], {shell: false, windowsHide: true})
            
                    pgctl.stdout.on('data', async function(msg){
                        if(msg.toString().includes("server started")) {
                            console.log("Database started!");
                            
                            openConnection();
        
                        }
                    });
                }
            } else {
                console.log("No database was found.");
                console.log("Trying to create database...");

                await new Promise((res, rej) => {
                    const initdb = spawn('cmd', ['/c', 'pg\\bin\\initdb', '-D', '%appdata%/ghanizadev/data', '-U', 'admin', '-E', 'UTF-8'], {shell: false, windowsHide: true});
                    initdb.stdout.on('data', function(msg){  
                        if(msg.toString().includes("Success. You can now start the database server using")) {
                            console.log("Database initialized.");
                            return res();
                        }else if(msg.toString().includes("error")) {
                            console.log("Error! Failed to initialize database!");
                            return rej();
                        };
                    });
                }).catch(() => process.exit(1));

                const inUse = await portInUse(5432);
                if(inUse) {
                    console.log('Port 5432 busy!');
                    process.exit(1);
                }
                else {
                    console.log('Starting database..');

                    await new Promise((res, rej) => {
                        const pgctl = spawn('cmd', ['/c', 'pg\\bin\\pg_ctl', 'start', '-D', '%appdata%/ghanizadev/data'], {shell: false, windowsHide: true})
                
                        pgctl.stdout.on('data', async function(msg){
                            if(msg.toString().includes("server started")) {
                                console.log("Database started!");
                                return res();        
                            }
    
                            if(msg.toString().includes("error")) {
                                console.log("Failed to start database!");
                                return rej();        
                            }
                        });
                    })
                }

                console.log('Running migrations...');

                await new Promise((res, rej) => {
                    const initdb = spawn('cmd', ['/c', 'pg\\bin\\createdb', '-U', 'admin', '-E', 'UTF-8', 'dedesoft'], {shell: false, windowsHide: true});
                    initdb.stdout.on('data', function(msg){  
                        if(msg.toString().includes("error")) {
                            console.log("Error! Failed to create database!");
                            return rej();
                        };
                    });
                    initdb.stdout.on('close', function(msg){  
                        console.log("Done.");
                        return res();
                    });
                }).catch(() => process.exit(1));

                const umzug = await runMigrations();
                if(!umzug) {
                    console.log("Failed to run migrations");
                    throw new Error();
                }

                console.log('Successfully migrated.');

                openConnection();
            }
          } catch(err) {
            console.error(err);
            process.exit(1);
          }
        
    }catch(e){
        console.error("Failed! reason: ", e.message);
        process.exit(1)
    }
}
const exitHandler = async () => {
    console.log("Gracefully exiting...");
    await new Promise((res) => {
        const pgctl = spawn('cmd', ['/c', 'pg\\bin\\pg_ctl', 'stop', '-D', '%appdata%/ghanizadev/data'], {detached: true, shell: false, windowsHide: true});
        pgctl.stdout.on('close', function(msg){  
            console.log("Goodbye.");
            return res();
        });
    })
    process.exit();
}
process.on('exit', () => exitHandler());
process.on('SIGINT', () => exitHandler());

run().catch(console.error)