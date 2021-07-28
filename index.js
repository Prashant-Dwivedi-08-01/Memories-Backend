import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors()); //! This must be Before the routes


app.get('/', (req,res)=>{
    res.send("Hello Welcome to Yadein");
})
app.use('/posts', postRoutes) //this means that, every url of post will be reached by localhost:5000/post
app.use('/user', userRoutes)


//MongoDB Cloud /ATLASmongodb+srv://Prashant:<password>@cluster0.myzaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// const CONNECTION_URL = 'mongodb+srv://Prashant:Prashant123@cluster0.myzaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000; //here we use 5000 OR the other one, which will be used while deployment

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);