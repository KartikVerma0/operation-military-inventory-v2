if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const equipmentRouter = require("./routes/equipmentRoute");
const pageRouter = require("./routes/pagesRoute");
const authRouter = require("./routes/authRoute");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const methodOverride = require("method-override");

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connection Established");
    })
    .catch(() => {
        console.log("Problem connecting to database");
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(methodOverride("_method"));

app.use("/", pageRouter);
app.use("/", authRouter);
app.use("/equipments", equipmentRouter);

app.all("*", (req, res) => {
    res.render("404 - Page Not Found", { title: "404 - Page Not Found" });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
