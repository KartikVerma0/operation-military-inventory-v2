const { mongoose } = require("./utils");

function connectToDB() {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Database Connection Established");
        })
        .catch(() => {
            console.log("Problem connecting to database");
        });

}

module.exports = connectToDB;