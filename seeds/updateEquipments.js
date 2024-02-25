const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connection Established");
    })
    .catch(() => {
        console.log("Problem connecting to database");
    });

const { Equipment } = require("../models/equipment");

const updateEquipments = async () => {
    let equipments = await Equipment.find();
    for (let i = 0; i < equipments.length; i++) {
        equipments[i].decomissionDetails = {
            hasDecomissioned: false,
        };
        await equipments[i].save();
    }
    mongoose.disconnect();
};

updateEquipments();
