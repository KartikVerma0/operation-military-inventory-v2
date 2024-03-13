const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const { isLoggedIn } = require("../middleware");

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

const DraftEquipment = require("../models/draftEquipment");

router
    .route("/")
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
                hasDecomissioned,
            } = req.body;

            const { equipmentIcon, images } = req.files;

            try {
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
                    decomissionDetails: {
                        hasDecomissioned,
                    },
                    user: req.user,
                }).save();

                return res.redirect(`/equipments/preview/${newEquipment._id}?view=draft`);
            } catch {
                req.flash("error", "Problem creating draft")
                return res.redirect(`/equipments/preview/${newEquipment._id}?view=draft`);
            }


        }
    );

module.exports = router;