const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const { isLoggedIn, hasRights } = require("../middleware");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "operationMilitaryInventory",
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.fieldname == "equipmentIcon" && file.mimetype == "image/png") {
            cb(null, true);
            return;
        } else if (
            file.fieldname == "equipmentIcon" &&
            file.mimetype != "image/png"
        ) {
            cb(
                new Error("Only png files are allowed in Equipment Icon"),
                false
            );
        }
        cb(null, true);
    },
});

const { Equipment, UnsavedEquipment } = require("../models/equipment");
const DraftEquipment = require("../models/draftEquipment");


router
    .route("/:id")
    .get(isLoggedIn, hasRights, async (req, res) => {
        const { id } = req.params;
        const { view } = req.query;
        let equipment = {};
        if (view == "draft") {
            equipment = await DraftEquipment.findById(id);
        } else if (view == "saved") {
            equipment = await Equipment.findById(id);
        } else if (view == "unsaved") {
            equipment = await UnsavedEquipment.findById(id);
        }
        res.render("equipmentEditForm", { equipment, view });
    })
    .put(
        isLoggedIn,
        hasRights,
        upload.fields([
            { name: "equipmentIcon", maxCount: 1 },
            { name: "images", maxCount: 10 },
        ]),
        async (req, res) => {
            const { id } = req.params;
            const {
                view,
                name,
                service,
                category,
                subCategory,
                description,
                users,
                learnMoreLink,
                videoLink,
                hasDecomissioned,
            } = req.body;

            const { equipmentIcon, images } = req.files;

            let newEquipment = {};
            if (view == "draft") {
                const equipment = await DraftEquipment.findById(id);
                equipment.name = name;
                equipment.service = service;
                equipment.category = category;
                if (equipment.subCategory) equipment.subCategory = subCategory;
                equipment.description = description;
                equipment.fullInfo.learnMoreLink = learnMoreLink;
                equipment.fullInfo.users = users;
                equipment.fullInfo.working.videoLink = videoLink;
                equipment.decomissionDetails.hasDecomissioned =
                    hasDecomissioned;
                if (equipmentIcon) {
                    equipment.preview.icon = equipmentIcon[0];
                }
                if (images) {
                    equipment.images.push(...images);
                }

                newEquipment = await equipment.save();
            } else if (view == "saved") {
                const equipment = await Equipment.findById(id);
                equipment.name = name;
                equipment.service = service;
                equipment.category = category;
                if (equipment.subCategory) equipment.subCategory = subCategory;
                equipment.description = description;
                equipment.fullInfo.learnMoreLink = learnMoreLink;
                equipment.fullInfo.users = users;
                equipment.fullInfo.working.videoLink = videoLink;
                equipment.decomissionDetails.hasDecomissioned =
                    hasDecomissioned;
                if (equipmentIcon) {
                    equipment.preview.icon = equipmentIcon[0];
                }
                if (images) {
                    equipment.images.push(...images);
                }

                newEquipment = await equipment.save();
            } else if (view == "unsaved") {
                const equipment = await UnsavedEquipment.findById(id);
                equipment.name = name;
                equipment.service = service;
                equipment.category = category;
                if (equipment.subCategory) equipment.subCategory = subCategory;
                equipment.description = description;
                equipment.fullInfo.learnMoreLink = learnMoreLink;
                equipment.fullInfo.users = users;
                equipment.fullInfo.working.videoLink = videoLink;
                equipment.decomissionDetails.hasDecomissioned =
                    hasDecomissioned;
                if (equipmentIcon) {
                    equipment.preview.icon = equipmentIcon[0];
                }
                if (images) {
                    equipment.images.push(...images);
                }

                newEquipment = await equipment.save();
            }
            res.redirect(
                `/equipments/preview/${newEquipment._id}?view=${view}`
            );
        }
    );

module.exports = router;