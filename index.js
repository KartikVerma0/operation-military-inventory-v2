import dotenv from "dotenv";
dotenv.config();


import express from "express";
const app = express();
const port = 3000;

import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";
import flash from "connect-flash";
import methodOverride from "method-override";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import equipmentRouter from "./routes/equipmentRoute.js";
import pageRouter from "./routes/pagesRoute.js";
import authRouter from "./routes/authRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";

import User from "./models/user.js";


import retry from "retry";

const connectWithRetry = async () => {
    const operation = retry.operation({
        retries: 5, // Number of retries
        minTimeout: 1000, // Initial backoff delay (1 second)
        maxTimeout: 5000 // Maximum backoff delay (5 seconds)
    });

    operation.attempt(async () => {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connection Established");
    });
};

connectWithRetry()
    .then(() => {
        // Your application logic here
    })
    .catch((error) => {
        console.error("Failed to connect to database after retries:", error);
        // Handle connection failures gracefully (e.g., exit or retry indefinitely)
    });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", "views");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
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
