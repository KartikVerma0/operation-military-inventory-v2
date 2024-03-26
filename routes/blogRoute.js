import dotenv from "dotenv";
dotenv.config();

import express from "express";
const router = express.Router();
import Blog from "../models/blog.js";
import { isLoggedIn } from "../middleware/middleware.js";
import axios from 'axios';

//setup crud for blog route
router.get("/", async (req, res) => {
    const apiKey = process.env.NEWS_APIKEY;
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=indian military&country=in&language=en`;

    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new Error(`Error fetching news: ${response.statusText}`);
        }
        const data = response.data;
        res.render("blog", { allBlogs: data.results });
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).send("Error fetching news");
    }
});

// router.get("/new", isLoggedIn, (req, res) => {
//     res.render("newBlog");
// });

// router.post("/", isLoggedIn, async (req, res) => {
//     const { headline, articleURL, thumbnailURL } = req.body;
//     const newBlog = new Blog({
//         headline,
//         articleURL,
//         thumbnailURL,
//         publishedDate: Date.now(),
//         lastModifiedDate: Date.now(),
//         author: "Admin",
//     });
//     newBlog.markModified("publishedDate");
//     await newBlog.save();
//     // req.flash("success", "Successfully Published a new Blog");
//     res.redirect("/blog");
// });

// router.get("/edit/:id", isLoggedIn, async (req, res) => {
//     const { id } = req.params;
//     const blog = await Blog.findById(id);
//     res.render("editBlog", { blog });
// });

// router.put("/edit/:id", isLoggedIn, async (req, res) => {
//     const { id } = req.params;
//     const { headline, articleURL, thumbnailURL } = req.body;
//     const blog = await Blog.findByIdAndUpdate(
//         { _id: id },
//         { headline, articleURL, thumbnailURL, lastModifiedDate: Date.now() }
//     );
//     res.redirect("/blog");
// });

export default router;
