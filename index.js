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

app.get("/equipments/:service", (req, res) => {
    const { service } = req.params;
    switch (service) {
        case "indianArmyEquipmentsPage.html":
            res.render("indianArmyEquipmentsPage");
            break;

        default:
            break;
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
