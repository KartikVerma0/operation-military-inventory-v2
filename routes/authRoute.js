const express = require("express");
const router = express.Router();

//setup authentication
router.get("/signin", (req, res) => {
    res.render("sign_in_page", { title: "Sign In" });
});

router.post("/signup", (req, res) => {});

router.post("/signin", (req, res) => {});

module.exports = router;
