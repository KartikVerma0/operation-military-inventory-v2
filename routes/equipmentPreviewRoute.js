const express = require("express");
const router = express.Router();

const { isLoggedIn, hasRights } = require("../middleware/middleware");

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
        }
        if (view == "saved") {
            equipment = await Equipment.findById(id);
        }
        if (view == "unsaved") {
            equipment = await UnsavedEquipment.findById(id);
        }
        if (equipment == undefined || equipment == null) {
            return res.status(404).send("Invalid ID")
        }
        res.render("equipmentPreview", { equipment, view });
    })
    .post(isLoggedIn, hasRights, async (req, res) => {
        const { id } = req.params;
        const { view } = req.body;
        let {
            service,
            category,
            subCategory,
            name,
            description,
            images,
            icon,
            videoLink,
            learnMoreLink,
            users,
            hasDecomissioned
        } = {};

        if (view == "draft") {
            const equipment = await DraftEquipment.findById(id);
            if (equipment == undefined || equipment == null) {
                return res.status(404).send("Invalid ID")
            }
            service = equipment.service;
            category = equipment.category;
            subCategory = equipment.subCategory;
            name = equipment.name;
            description = equipment.description;
            images = equipment.images;
            icon = equipment.preview.icon;
            videoLink = equipment.fullInfo.working.videoLink;
            learnMoreLink = equipment.fullInfo.learnMoreLink;
            users = equipment.fullInfo.users;
            user = equipment.user;
            hasDecomissioned = equipment.decomissionDetails.hasDecomissioned;

            await new UnsavedEquipment({
                service,
                category,
                subCategory,
                name,
                description,
                images,
                preview: {
                    icon,
                },
                fullInfo: {
                    learnMoreLink,
                    users,
                    working: {
                        videoLink,
                    },
                },
                user,
                decomissionDetails: {
                    hasDecomissioned
                },
            }).save();

            await equipment.deleteOne();
            req.flash("success", "Your New Equipment will soon be processed.");

        }

        if (view == "unsaved") {
            if (res.locals.currentUser.role === "user") {
                req.flash("error", "You are not authorized.")
                return res.status(401).redirect("/dashboard");
            } else if (res.locals.currentUser.role === "administrator" || res.locals.currentUser.role === "moderator") {
                const equipment = await UnsavedEquipment.findById(id);
                if (equipment == undefined || equipment == null) {
                    return res.status(404).send("Invalid ID")
                }
                service = equipment.service;
                category = equipment.category;
                subCategory = equipment.subCategory;
                name = equipment.name;
                description = equipment.description;
                images = equipment.images;
                icon = equipment.preview.icon;
                videoLink = equipment.fullInfo.working.videoLink;
                learnMoreLink = equipment.fullInfo.learnMoreLink;
                users = equipment.fullInfo.users;
                user = equipment.user;
                hasDecomissioned = equipment.decomissionDetails.hasDecomissioned;

                await new Equipment({
                    service,
                    category,
                    subCategory,
                    name,
                    description,
                    images,
                    preview: {
                        icon,
                    },
                    fullInfo: {
                        learnMoreLink,
                        users,
                        working: {
                            videoLink,
                        },
                    },
                    user,
                    decomissionDetails: {
                        hasDecomissioned
                    },
                }).save();

                await equipment.deleteOne();
                req.flash("success", "Your New Equipment is published.");
            }

        }

        if (view == "saved") {
            const equipment = await Equipment.findById(id);
            if (equipment == undefined || equipment == null) {
                return res.status(404).send("Invalid ID")
            }
            service = equipment.service;
            // category = equipment.category;
            // name = equipment.name;
            // description = equipment.description;
            // images = equipment.images;
            // icon = equipment.preview.icon;
            // videoLink = equipment.fullInfo.working.videoLink;
            // learnMoreLink = equipment.fullInfo.learnMoreLink;
            // users = equipment.fullInfo.users;
        }
        res.redirect(`/equipments/${service}`);
    });

module.exports = router;