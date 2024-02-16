const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const { isLoggedIn, hasRights } = require("../middleware");

// Configure cloudinary instance with your cloudinary credentials
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

const { Equipment } = require("../modals/equipment");
const DraftEquipment = require("../modals/draftEquipment");
const {
    serviceCategories,
    subCategoriesArray,
} = require("../public/js/categoryArrayForBackend");

const fulldata = require("../public/json/data.json");

router
    .route("/new")
    .get(isLoggedIn, (req, res) => {
        res.render("newEquipmentForm");
    })
    .post(
        isLoggedIn,
        (req, res, next) => {
            upload.fields([
                { name: "equipmentIcon", maxCount: 1 },
                { name: "images", maxCount: 10 },
            ])(req, res, function (err) {
                // Handle multer errors
                if (err instanceof multer.MulterError) {
                    // Delete uploaded files if any
                    if (req.files) {
                        req.files.forEach((file) => {
                            fs.unlink(file.path, (err) => {
                                if (err) {
                                    console.error("Error deleting file:", err);
                                }
                            });
                        });
                    }
                    return res.status(400).json({ error: err.message });
                } else if (err) {
                    return res.status(500).json({ error: "Server error" });
                }
                next();
            });
        },
        async (req, res) => {
            const {
                name,
                service,
                category,
                subCategory,
                description,
                users,
                learnMoreLink,
                videoLink,
            } = req.body;

            const { equipmentIcon, images } = req.files;

            const newEquipment = await new DraftEquipment({
                service,
                category,
                subCategory,
                name,
                description,
                images,
                preview: {
                    icon: equipmentIcon[0],
                },
                fullInfo: {
                    learnMoreLink,
                    users,
                    working: {
                        videoLink,
                    },
                },
                user: req.user,
            }).save();

            res.redirect(`/equipments/preview/${newEquipment._id}?view=draft`);
        }
    );

router
    .route("/preview/:id")
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

        res.render("equipmentPreview", { equipment, view });
    })
    .post(isLoggedIn, hasRights, async (req, res) => {
        const { id } = req.params;
        const { view } = req.body;
        let {
            service,
            category,
            name,
            description,
            images,
            icon,
            videoLink,
            learnMoreLink,
            users,
        } = {};

        if (view == "draft") {
            const equipment = await DraftEquipment.findById(id);
            service = equipment.service;
            category = equipment.category;
            name = equipment.name;
            description = equipment.description;
            images = equipment.images;
            icon = equipment.preview.icon;
            videoLink = equipment.fullInfo.working.videoLink;
            learnMoreLink = equipment.fullInfo.learnMoreLink;
            users = equipment.fullInfo.users;
            user = equipment.user;

            await new Equipment({
                service,
                category,
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
            }).save();

            await equipment.deleteOne();
        }

        if (view == "saved") {
            const equipment = await Equipment.findById(id);
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

router
    .route("/edit/:id")
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
router.get("/IN", (req, res) => {
    const renderInfoObject = {
        title: "Indian Navy Equipments",
        fulldata,
        service: "IN",
    };
    res.render("indianNavyEquipmentsPage", renderInfoObject);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);
    await equipment.populate("user");
    res.render("equipment", equipment);
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
    res.redirect(`/equipments/${service}`);
});

module.exports = router;
