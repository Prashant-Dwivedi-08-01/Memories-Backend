//* We Create Controllers beacuse we dont want to write logics in original routes file.
//* We use routes/posts.js only for routing and write the functions here controllers/posts.js

import PostMessage from "../models/postMessage.js"
import mongoose from "mongoose";


export const getPost = async (req, res)=>{
    
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        console.log(error);
    }
}

export const getPosts = async (req,res)=>{
   
    const { page } = req.query;
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        // sort all the posts-->Return the limited number of post-->Return after skipping the posts till startIndex
        const posts = await PostMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT) })
        
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

export const getPostsBySearch = async (req, res) =>{
   
    //?  point to note is that, req.query is inbuild just like req.params. Here, url--> ...?searchQuery=.....&tags=....
    //? So here the names after ? goes into the varible query in req.
    
    const { searchQuery, tags} = req.query; 

    try {
        const title = new RegExp(searchQuery, "i"); // it means ignore all the cases like TEST, test, Test ...etc-->test
        
        const posts = await PostMessage.find({$or: [{ title },{ tags: { $in: tags.split(',') } }]});
        // console.log(posts);
        res.json({ data: posts});

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const createPost = async (req,res)=>{
    const post = req.body;
    const  newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message: error})
    }

}

export const updatePost = async (req,res)=>{
    const { id : _id} = req.params;
    const post = req.body;
    
    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("No Such Post Exits");
    
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true}); //? new:true says to return the newly update data

    res.json(updatedPost);
}

export const deletePost = async (req,res)=>{
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send("No Such Post Exits");
    
   await PostMessage.findByIdAndRemove(id);

    res.json("Deleted Success fully");
}

// allow only one like per user. If same user again clicks on the like button then dislike it
export const likePost = async(req, res)=>{
    const { id } = req.params;

    if(!req.userId){
        return res.json({message: "User is not Authenticated"});
    } 

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send("No such Post Exits");

    var post = await PostMessage.findById(id);

    // post.likes is an arrya and index is javascript function on arrays. This is not related to database functions
    const index = post.likes.findIndex((this_id) => this_id === String(req.userId)); //? -1 if no userId found.

    if( index === -1){
        // like the post
        post.likes.push(String(req.userId));
    }
    else{
        // dislike the post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
   
    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new: true});
    res.json(updatedPost);
}

 export const commentPost = async (req, res) => {
    const { id } = req.params;
    const {comment}  = req.body; //! as it was sent by destructuring from api in frontend

    const post = await PostMessage.findById(id);
    post.comments.push(comment);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});

    res.json(updatedPost);
}