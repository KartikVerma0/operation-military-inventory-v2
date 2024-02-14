const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the options for virtuals and other schema settings
const opts = { toJSON: { virtuals: true } };

// Define the schema for the preview of equipment
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

// Define the schema for the full information of equipment
const equipmentFullInfoSchema = new Schema(
    {
        learnMoreLink: String,
        users: [
            {
                type: String,
                require: true,
            },
            // Flag link and country name go here
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

// Define the schema for images
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

// Define the equipment schema
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
    // Add createdAt field to track creation time
    createdAt: {
        type: Date,
        default: Date.now, // Set default value to current date/time
        expires: 30 * 24 * 60 * 60, // Expire documents after 30 days
    },
});

// Create DraftEquipment model with equipment schema
const DraftEquipment = mongoose.model("DraftEquipment", equipmentSchema);

module.exports = DraftEquipment;
