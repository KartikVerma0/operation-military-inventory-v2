require("dotenv").config();


const express = require("express");
const app = express();
const port = 3000;


const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const equipmentRouter = require("./routes/equipmentRoute");
const pageRouter = require("./routes/pagesRoute");
const authRouter = require("./routes/authRoute");
const dashboardRouter = require("./routes/dashboardRoute");

const User = require("./models/user");


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connection Established");
    })
    .catch(() => {
        console.log("Problem connecting to database");
    });


app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 14 * 24 * 60 * 60,
    }),
};
app.use(express.urlencoded({ extended: true }));
app.use(session(sess));
app.use(flash());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", pageRouter);
app.use("/", authRouter);
app.use("/", dashboardRouter);
app.use("/equipments", equipmentRouter);

app.all("*", (req, res) => {
    res.render("404 - Page Not Found", { title: "404 - Page Not Found" });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
