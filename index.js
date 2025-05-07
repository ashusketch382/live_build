const express = require("express");
const cors = require("cors");
require('dotenv').config();
const {PrismaClient} = require("@prisma/client");
const { WebSocketServer } = require("ws");
const WebSocket = require("ws");
const http = require("http");
const { Client } = require("pg");
const client = require('prom-client');
const { metricsMiddleware } = require("./metrics");
const { activeConnections, totalConnections, messagesReceived } = require("./metrics/web_socket_requests");
const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(metricsMiddleware);
//create a http server
const server = http.createServer(app);

//create a websocket server using http server
const wss = new WebSocketServer({ server });

//configure the PostgreSQL client for listening DB triggers
const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
});
pgClient.connect();

//Listen for notifications on build_status_update channel
pgClient.query('LISTEN build_status_update');


wss.on('connection', function connection(ws){
    activeConnections.inc();
    totalConnections.inc();
    console.log("socket connection established");
    ws.on('message', (message) => {
        messagesReceived.inc();
    });
    ws.on('close', () => {
        activeConnections.dec();
        console.log("socket connection removed");
    })
    //get the error
    ws.on('error', console.error);
});

//when a notification is recieved, broadcast it to WebSocket clients
pgClient.on('notification', (msg) => {
    const payload = JSON.parse(msg.payload);
    console.log('Database notification received: ',payload);
    // Broadcast the update to all WebSocket clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(payload));
        }
    });
})

app.get('/allBuild', async (req,res) => {
    try {
        const allBuilds = await prisma.build.findMany();
        console.log(allBuilds);
        res.status(200).json({
            message: "fetched all builds",
            data: allBuilds
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            err: error,
            message: "bad request"
        })        
    }
});
app.get('/build', async(req,res) => {
    try {
        const { feature } = req.query;
        console.log(feature);
        const build = await prisma.build.findMany({
            where: {
                name: {
                    contains: feature
                }
            }
        })
        res.status(200).json({
            data: build,
            message: "Succesfully fetched the build"
        })
    } catch (error) {
        console.log(error);
        res.status(200).json({
            data: {},
            message: "something went wrong",
            err: error
        })
    }
})
app.post('/createBuild', async (req, res) => {
    try {
        const {name, content, buildStartTime, onpremStatus, dockerStatus, comments} = req.body;
        const build = await prisma.build.create({
            data: {
                name, 
                content, 
                buildStartTime, 
                onpremStatus, 
                dockerStatus, 
                comments
            }
        });
        // console.log(build);
        res.status(200).json({
            message: "created build entry"
        });
    } catch (error) {
        if (error.code === 'P2002') { // Prisma's unique constraint violation code
            res.status(400).json({
                message: "Build with the same name already exists",
            });
        } else {
            res.status(500).json({
                message: "Internal server error",
                error,
            });
        }
    }
});
app.put('/build', async (req,res) => {
    try {
        const { feature } = req.query;
        console.log(feature);
        const data = req.body;
        console.log(data);
        const build = await prisma.build.updateMany({
            where: {
                name: {
                    contains: feature
                }
            },
            data: data
        })
        res.status(200).json({
            message: "successfully udpated the data",
            data: build
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "something went wrong",
            err: error
        })
    }
})

app.put('/startUpdateBuilds', async (req,res) => {
    try {
        const data = {
            buildStartTime: null,
            buildEndTime: null,
            onpremStatus: "Build Waiting",
            dockerStatus: "Build Waiting",
            comments: "Build Waiting"
        };
        const build = await prisma.build.updateMany({
            where: {},
            data: data
        })
        res.status(200).json({
            message: "successfully udpated the data",
            data: build.count
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "something went wrong",
            err: error
        })
    }
})
app.delete('/delete', async (req,res) => {
    try {
    const response = await prisma.build.deleteMany({})
    res.status(200).json({
        message: "Succefully deleted the data"
    })
    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            err: error
        })
    }
})

app.post("/snapshots", async (req, res) => {
    try {
        const builds = await prisma.build.findMany();
    for (const build of builds) {
        await prisma.buildSnapshot.create({
            data: {
                buildId: build.id,
                name: build.name,
                content: build.content,
                buildStartTime: build.buildStartTime,
                buildEndTime: build.buildEndTime,
                onpremStatus: build.onpremStatus,
                dockerStatus: build.dockerStatus,
                comments: build.comments,
                snapshotDate: new Date(),
            },
        });
    }
    console.log('Snapshot completed successfully!');
    res.status(200).json({
        message: "successfully udpated the data",
        data: builds.length
    });
    } catch (error) {
        console.error('Error taking snapshot:', error);
        res.status(500).json({
            message: "something went wrong",
            err: error
        });
    }
});

app.get('/snapshots', async(req,res) => {
    try {
        const { date } = req.query;
        const snapshotDate = new Date(date);
        console.log(date);
        const snapshots = await prisma.buildSnapshot.findMany({
            where: {
              snapshotDate: {
                gte: new Date(snapshotDate.setUTCHours(0,0,0,0)),
                lte: new Date(snapshotDate.setUTCHours(23,59,59,999)),
              },
            },
          });
        res.status(200).json({
            data: snapshots,
            message: "Succesfully fetched the snapshots"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            data: {},
            message: "something went wrong",
            err: error
        })
    }
})

app.delete("/deleteSnapshot", async (req,res) => {
    try {
        const response = await prisma.buildSnapshot.deleteMany({
            where: {
              snapshotDate: {
                lt: new Date(new Date().setDate(new Date().getDate() - 90)),
              },
            },
          });
        res.status(200).json({
            message: "Succefully deleted the old snapshot"
        });
    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            err: error
        });
    }
})
app.get("/metrics", async(req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.send(metrics);
})
server.listen(process.env.PORT, ()=>{
        console.log("server started on PORT ", process.env.PORT)
});