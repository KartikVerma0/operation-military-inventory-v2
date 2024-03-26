import express from "express";
const router = express.Router();
import blogRouter from "./blogRoute.js";

import indexPageData from "../public/json/indexPage.js";


router.get("/", (req, res) => {
    res.render("index", { categories: indexPageData });
});

router.use("/blog", blogRouter);

router.get("/team", (req, res) => {
    res.render("team");
});

//setup a post route to store feedbacks in mongo
router.get("/feedback", (req, res) => {
    res.render("feedback_page");
});

router.get("/contact", (req, res) => {
    res.render("contact_page");
});

export default router;
