
import express from "express";
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
import messageRoutes from "./routes/messages/messages.js";
import wssEvents from "./web-socket-events.js";
import axios from "axios";
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
app.use('/messages', authorizeFromToken, messageRoutes)


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

app.get('/health', (req, res) => {
  res.json({ok:true})
});


app.use("/", (err, req, res, next) => {
  res.status(500).json({ Message: "Error Occurred!!" });
});

var server;
createGridStream().then(x => {
  bucket = x;


  server = app.listen(process.env.PORT || 3001, () => {

    wssEvents.emit('start-web-socket', server)
    console.log("Server started");
    setInterval(()=>{
        axios.get(process.env.SERVER_URL + '/health').then(()=>{
          console.log('Server is active...', new Date().toISOString())
        }).catch(e=>{
          console.log("Eror in health check",e)
        })
    },Number(process.env.KEEP_ALIVE_INTERVAL || "300000"))
  });

  


})




