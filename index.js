
import express from "express";
import fs from 'fs'
import cors from 'cors'

import productRoutes from "./routes/products/products.js";
import songRoutes from "./routes/songs/songs.js";
import userRoutes from "./routes/users/users.js";
import miscRoutes from "./routes/misc/misc.js";
import thoughsRouter from "./routes/thoughts/thought.js";
import signupRoutes from './routes/signup/singup.js'
import dotenv from 'dotenv'
import { authorizeFromDatabase as authorizeFromDatabase, authorizeFromToken } from "./auth-util.js";
import mongo from "mongodb";
import { upload } from "./grid-fs.util.js";
dotenv.config();

export function getUrl() {
  return process.env.CONNECTION_STRING
}

const app = express();

var bucket;

async function createGridStream() {
  return new Promise((resolve, reject) => {


    new mongo.MongoClient(process.env.CONNECTION_STRING).connect().then(client => {
      const db = client.db(process.env.DEFAULT_DATABASE);
      resolve(new mongo.GridFSBucket(db, { bucketName: 'uploads' }));
    }).catch(e => {
      reject(e)
    })
  })
}

app.use(express.json())
app.use(cors())

app.use("/users", authorizeFromDatabase, userRoutes)


app.use("/products", authorizeFromToken, productRoutes)
app.use("/misc", miscRoutes)
app.use("/thoughts", authorizeFromToken, thoughsRouter)
app.use("/songs", songRoutes)
app.use('/signup', signupRoutes)


app.post('/app-image-upload', upload.single('myFile'), (req, res) => {
  res.json(req.file)
})


app.get('/image/:filename', (req, res) => {

  bucket.find({ filename: req.params.filename }).toArray().then((files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    const stream = bucket.openDownloadStreamByName(req.params.filename)
    stream.pipe(res)
  });
});



createGridStream().then(x => {
  bucket = x;

  app.listen(3001, () => {
    console.log("Server started");
  });

})


