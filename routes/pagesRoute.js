const express = require("express");
const router = express.Router();
const blogRouter = require("./blogRoute");

const indexPageData = require("../public/json/indexPage.json");

router.get("/", (req, res) => {
    res.render("index", { categories: indexPageData["categories"] });
});

router.use("/blog", blogRouter);

router.get("/team", (req, res) => {
    res.render("team");
});

//setup a post route to store feedbacks in mongo
router.get("/feedback", (req, res) => {
    res.render("feedback_page", { title: "Feedback" });
});

router.get("/contact", (req, res) => {
    res.render("contact_page", { title: "Contact Us" });
});

module.exports = router;
