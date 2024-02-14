const mongoose = require("mongoose");
const { Schema } = mongoose;

const opts = { toJSON: { virtuals: true } };
const equipmentPreviewSchema = new Schema(
    {
        icon: {
            originalname: String,
            encoding: String,
            mimetype: String,
            path: String,
            size: Number,
            filename: String,
            fieldname: String,
        },
    },
    opts
);

equipmentPreviewSchema.virtual("fullInfoLink").get(function () {
    // return `/equipments/${
    //     this.parent().service
    // }/${this.parent().category}/${this.parent().name}`;
    return "/equipments/" + this.parent()._id;
});
equipmentPreviewSchema.virtual("onHover.imgSrc").get(function () {
    return this.parent().images[0].path;
});
equipmentPreviewSchema.virtual("onHover.description").get(function () {
    const desc = this.parent().description;
    return desc.length <= 300 ? desc : desc.substring(0, 300) + "  ......";
});

const equipmentFullInfoSchema = new Schema(
    {
        learnMoreLink: String,
        users: [
            {
                type: String,
                require: true,
            },
            //flag link
            // https://flagcdn.com/24x18/<%= fullInfo.users[index].split(' ,')[1].trim()
            //country name
            //fullInfo.users[index].split(',')[0].trim()
        ],
        working: {
            videoLink: String,
        },
    },
    opts
);

equipmentFullInfoSchema.virtual("carouselImages").get(function () {
    return this.parent().images.slice(0, 5);
});
equipmentFullInfoSchema.virtual("gallery").get(function () {
    return this.parent().images.slice(5, 10);
});
equipmentFullInfoSchema.virtual("description").get(function () {
    return this.parent().description;
});
equipmentFullInfoSchema.virtual("title").get(function () {
    return this.parent().name;
});

const imageSchema = new mongoose.Schema(
    {
        // Define other properties of your image schema
        originalname: String,
        encoding: String,
        mimetype: String,
        path: String,
        size: Number,
        filename: String,
        fieldname: String,
    },
    { _id: false }
);

const equipmentSchema = new mongoose.Schema({
    service: {
        type: String,
        require: true,
        enum: ["IA", "IAF", "IN"],
    },
    category: { type: String, require: true },
    subCategory: String,
    name: { type: String, require: true },
    description: { type: String, require: true },
    images: [{ type: imageSchema }],
    preview: {
        type: equipmentPreviewSchema,
        require: true,
    },
    fullInfo: {
        type: equipmentFullInfoSchema,
        require: true,
    },
});

const UnsavedEquipment = mongoose.model("UnsavedEquipment", equipmentSchema);
const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = { Equipment, UnsavedEquipment };
