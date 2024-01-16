const express = require("express");
const router = express.Router();
const Blog = require("../modals/blogSchema");

//setup crud for blog route
router.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("blog", { allBlogs });
});

router.get("/new", (req, res) => {
    res.render("newBlog");
});

router.post("/", async (req, res) => {
    const { headline, articleURL, thumbnailURL } = req.body;
    const newBlog = new Blog({
        headline,
        articleURL,
        thumbnailURL,
        publishedDate: Date.now(),
        lastModifiedDate: Date.now(),
        author: "Admin",
    });
    newBlog.markModified("publishedDate");
    await newBlog.save();
    // req.flash("success", "Successfully Published a new Blog");
    res.redirect("/blog");
});

router.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.render("editBlog", { blog });
});

router.put("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { headline, articleURL, thumbnailURL } = req.body;
    const blog = await Blog.findByIdAndUpdate(
        { _id: id },
        { headline, articleURL, thumbnailURL, lastModifiedDate: Date.now() }
    );
    res.redirect("/blog");
});

module.exports = router;
