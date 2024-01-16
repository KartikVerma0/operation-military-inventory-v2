const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
    category: String,
    name: String,
    preview: {
        imgSrc: String,
        onHover: {
            imgSrc: String,
            desc: String,
        },
        fullInfoLink: String,
    },
    fullInfo: {
        title: String,
        desc: String,
        learnMoreLink: String,
        carouselImages: [String],
        users: [[String]],
        gallery: [String],
        working: {
            videoLink: String,
        },
    },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
