const express = require("express");
require('dotenv').config();
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(express.urlencoded());

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
        console.log(build);
        res.status(200).json({
            message: "created build entry"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            err: error,
            message: "bad request"
        })
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
app.listen(process.env.PORT, ()=>{
        console.log("server started on PORT 3000")
    });