import mongoose from "mongoose"

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name:String, //name os user who logged in
    creator: String,// this is an ID
    tags: [String],
    selectedFile: String,
    likes : {
        type: [String], //? This is storing the ID's of users who liked the post.
        default: 0
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt:{
        type: Date,
        default : new Date()
    }
})

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;