const express = require("express");
const router = express.Router();

const { Equipment } = require("../models/equipment");
const DraftEquipment = require("../models/draftEquipment");

const { isLoggedIn } = require("../middleware");

router.get("/dashboard", isLoggedIn, async (req, res) => {
    const id = res.locals.currentUser._id;
    const draftEquipments = await DraftEquipment.find({ user: id });
    const savedEquipments = await Equipment.find({ user: id });
    res.render("dashboard", { draftEquipments, savedEquipments });
});

module.exports = router;
