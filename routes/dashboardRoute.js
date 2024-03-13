const express = require("express");
const router = express.Router();

const { Equipment, UnsavedEquipment } = require("../models/equipment");
const DraftEquipment = require("../models/draftEquipment");

const { isLoggedIn } = require("../middleware");

router.get("/dashboard", isLoggedIn, async (req, res) => {
    const id = res.locals.currentUser._id;
    if (res.locals.currentUser.role === "administrator") {
        const draftEquipments = await DraftEquipment.find({ user: id });
        const savedEquipments = await Equipment.find({ user: id });
        const unsavedEquipments = await UnsavedEquipment.find({});
        return res.render("adminDashboard", { draftEquipments, savedEquipments, unsavedEquipments });
    }
    const draftEquipments = await DraftEquipment.find({ user: id });
    const savedEquipments = await Equipment.find({ user: id });
    const unsavedEquipments = await UnsavedEquipment.find({ user: id });
    return res.render("dashboard", { draftEquipments, savedEquipments, unsavedEquipments });
});

module.exports = router;
