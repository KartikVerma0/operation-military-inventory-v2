import mongoose from "mongoose";
const { Schema } = mongoose;

const blogSchema = new Schema({
    thumbnailURL: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
    },
    articleURL: {
        type: String,
        required: true,
    },
    publishedDate: {
        type: Date,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    lastModifiedDate: {
        type: Date,
        required: true,
    },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
