const express = require("express");
const router = express.Router();

const fulldata = require("../public/json/data.json");

router.get("/:service", (req, res) => {
    const { service } = req.params;
    const renderInfoObject = {
        title: "",
        fulldata,
        service,
    };
    switch (service) {
        case "IA":
            renderInfoObject.title = "Indian Army Equipments";
            break;
        case "IAF":
            renderInfoObject.title = "Indian Airforce Equipments";
            break;
        case "IN":
            renderInfoObject.title = "Indian Navy Equipments";
            break;
        default:
            res.render("404 - Page Not Found", {
                title: "404 - Page Not Found",
            });
            break;
    }
    res.render("servicePage", renderInfoObject);
});

router.get("/:service/category/:category", (req, res) => {
    const { service, category } = req.params;
    res.render("categoryPage", {
        title: category,
        service,
        fulldata,
    });
});

router.get("/:service/:category/:equipment", (req, res) => {
    const { service, category, equipment } = req.params;
    res.render("equipment", { service, category, title: equipment, fulldata });
});

module.exports = router;
