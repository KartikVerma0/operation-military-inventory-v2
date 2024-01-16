const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
    thumbnailURL: {
        type: String,
        require: true,
    },
    headline: {
        type: String,
        require: true,
    },
    articleURL: {
        type: String,
        require: true,
    },
    publishedDate: {
        type: Date,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    lastModifiedDate: {
        type: Date,
        require: true,
    },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
