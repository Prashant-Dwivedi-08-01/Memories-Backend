import express from 'express'
import {getPost, getPosts, getPostByUserId, createPost, updatePost, deletePost, likePost,commentPost, getPostsBySearch} from "../controllers/posts.js"

import auth from '../middleware/auth.js';

const router = express.Router();

//not accessed by localhost:5000/ but ../post as we have said it in index.js
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/user/:userId', getPostByUserId);


router.post("/", auth, createPost);
router.patch("/:id", auth,  updatePost);
router.delete("/:id", auth,  deletePost);
router.patch("/:id/likePost",auth,  likePost);
router.post("/:id/comment",auth,  commentPost);

export default router;