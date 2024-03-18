import express from "express";
const router = express.Router();

import { Equipment, UnsavedEquipment } from "../models/equipment.js";
import DraftEquipment from "../models/draftEquipment.js";

import { isLoggedIn } from "../middleware/middleware.js";

router.get("/dashboard", isLoggedIn, async (req, res) => {
    const id = res.locals.currentUser._id;
    if (res.locals.currentUser.role === "administrator") {
        try {
            const draftEquipments = await DraftEquipment.find({ user: id });
            const savedEquipments = await Equipment.find({ user: id });
            const unsavedEquipments = await UnsavedEquipment.find({});
            return res.render("adminDashboard", { draftEquipments, savedEquipments, unsavedEquipments });
        } catch {
            return res.status(500).send("Invalid ID")
        }
    }
    try {
        const draftEquipments = await DraftEquipment.find({ user: id });
        const savedEquipments = await Equipment.find({ user: id });
        const unsavedEquipments = await UnsavedEquipment.find({ user: id });
        return res.render("dashboard", { draftEquipments, savedEquipments, unsavedEquipments });
    } catch {
        return res.status(500).send("Invalid ID")
    }
});

export default router;
