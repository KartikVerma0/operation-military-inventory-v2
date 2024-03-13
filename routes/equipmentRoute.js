const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const equipmentEditRoute = require("./equipmentEditRoute");
const newEquipmentRoute = require("./newEquipmentRoute");
const equipmentPreviewRoute = require("./equipmentPreviewRoute");

const { isLoggedIn, hasRights } = require("../middleware");

const { Equipment, UnsavedEquipment } = require("../models/equipment");
const DraftEquipment = require("../models/draftEquipment");
const {
    serviceCategories, subCategoriesArray
} = require("../public/js/categoryArrayForBackend");

const fulldata = require("../public/json/data.json");

router.use("/new", newEquipmentRoute);

router.use("/preview", equipmentPreviewRoute);

router.use("/edit", equipmentEditRoute);

router.get("/IA", async (req, res) => {
    const equipments = await Equipment.find({ service: "IA" });
    const renderInfoObject = {
        title: "Indian Army Equipments",
        equipments,
        serviceCategories,
        fulldata,
        service: "IA",
    };
    res.render("indianArmyEquipmentsPage", renderInfoObject);
});

//update required
router.get("/IAF", async (req, res) => {
    const equipments = await Equipment.find({ service: "IAF" });
    const renderInfoObject = {
        title: "Indian Airforce Equipments",
        equipments,
        serviceCategories,
        fulldata,
        service: "IAF",
    };
    res.render("indianAirforceEquipments", renderInfoObject);
});

//update required
router.get("/IN", async (req, res) => {
    const equipments = await Equipment.find({ service: "IN" });
    const renderInfoObject = {
        title: "Indian Navy Equipments",
        equipments,
        serviceCategories,
        subCategoriesArray,
        fulldata,
        service: "IN",
    };
    res.render("indianNavyEquipmentsPage", renderInfoObject);
});

router.get("/unsaved/:id", async (req, res) => {
    const { id } = req.params;
    const equipment = await UnsavedEquipment.findById(id);
    await equipment.populate("user");
    res.render("equipment", { equipment, view: "unsaved" });
});
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);
    await equipment.populate("user");
    res.render("equipment", { equipment, view: "saved" });
});

router.get("/:service/category/:category", async (req, res) => {
    const { service, category } = req.params;
    const equipments = await Equipment.find({ service, category });
    res.render("categoryPage", { equipments });
});

// Handle image deletion
router.delete("/delete-icon/:publicId", isLoggedIn, async (req, res) => {
    const { publicId } = req.params;
    const { view } = req.query;
    cloudinary.api.delete_resources(
        ["operationMilitaryInventory/" + publicId],
        {
            type: "upload",
            resource_type: "image",
        }
    );
    let equipment = {};
    if (view == "draft") {
        equipment = await DraftEquipment.findOne({
            "preview.icon.filename": "operationMilitaryInventory/" + publicId,
        });
    } else if (view == "saved") {
        equipment = await Equipment.findOne({
            "preview.icon.filename": "operationMilitaryInventory/" + publicId,
        });
    }
    // console.log(equipment.preview._id);

    equipment.preview.icon = null;
    // console.log(equipment);

    await equipment.save();
    res.send("Image deleted");
});

router.delete("/delete-image/:publicId", isLoggedIn, async (req, res) => {
    const { publicId } = req.params;
    const { view } = req.query;

    cloudinary.api.delete_resources(
        ["operationMilitaryInventory/" + publicId],
        {
            type: "upload",
            resource_type: "image",
        }
    );
    let equipment = {};
    if (view == "draft") {
        equipment = await DraftEquipment.findOne({
            "images.filename": "operationMilitaryInventory/" + publicId,
        });
    } else if (view == "saved") {
        equipment = await Equipment.findOne({
            "images.filename": "operationMilitaryInventory/" + publicId,
        });
    }
    // console.log(equipment.images[0]._id);
    // const iconObj = equipment.preview.icon.id(equipment.preview._id);
    // console.log(iconObj);

    equipment.images.id(equipment.images[0]).deleteOne();
    // console.log(equipment);

    // equipment.preview.icon = null;
    // console.log(equipment);

    await equipment.save();
    res.status(200);
});

router.delete("/delete/:id", isLoggedIn, hasRights, async (req, res) => {
    const { id } = req.params;
    const { view, service } = req.body;

    if (view == "draft") {
        const equipment = await DraftEquipment.findById(id);
        const images = equipment.images;
        const icon = equipment.preview.icon;

        cloudinary.api.delete_resources([icon.filename], {
            type: "upload",
            resource_type: "image",
        });

        for (let i = 0; i < images.length; i++) {
            cloudinary.api.delete_resources([images[i].filename], {
                type: "upload",
                resource_type: "image",
            });
        }

        await equipment.deleteOne();
    }
    if (view == "saved") {
        const equipment = await Equipment.findById(id);
        const images = equipment.images;
        const icon = equipment.preview.icon;

        cloudinary.api.delete_resources([icon.filename], {
            type: "upload",
            resource_type: "image",
        });

        for (let i = 0; i < images.length; i++) {
            cloudinary.api.delete_resources([images[i].filename], {
                type: "upload",
                resource_type: "image",
            });
        }

        await equipment.deleteOne();
    }
    if (view == "unsaved") {
        const equipment = await UnsavedEquipment.findById(id);
        const images = equipment.images;
        const icon = equipment.preview.icon;

        cloudinary.api.delete_resources([icon.filename], {
            type: "upload",
            resource_type: "image",
        });

        for (let i = 0; i < images.length; i++) {
            cloudinary.api.delete_resources([images[i].filename], {
                type: "upload",
                resource_type: "image",
            });
        }

        await equipment.deleteOne();
    }
    req.flash("success", "Successfully Deleted Equipment")
    res.redirect(`/equipments/${service}`);
});

module.exports = router;
