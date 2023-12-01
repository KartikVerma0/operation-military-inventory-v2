const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/blog", (req, res) => {
    res.render("blog");
});

app.get("/team", (req, res) => {
    res.render("team");
});

app.get("/feedback", (req, res) => {
    res.render("feedback_page");
});

app.get("/contact", (req, res) => {
    res.render("contact_page");
});

app.get("/signIn", (req, res) => {
    res.render("sign_in_page");
});

app.get("/equipments/:service", (req, res) => {
    const { service } = req.params;
    switch (service) {
        case "IA":
            res.render("indianArmyEquipmentsPage");
            break;
        case "IAF":
            res.render("indianAirforceEquipments");
            break;
        case "IN":
            res.render("indianNavyEquipmentsPage");
            break;
        default:
            res.render("404");
            break;
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
