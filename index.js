if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const { app, port } = require("./config/config")
const { express, path, session, flash, methodOverride, mongoose, MongoStore, passport, LocalStrategy } = require("./config/utils")
const connectToDB = require("./config/db")

const equipmentRouter = require("./routes/equipmentRoute");
const pageRouter = require("./routes/pagesRoute");
const authRouter = require("./routes/authRoute");
const dashboardRouter = require("./routes/dashboardRoute");

const User = require("./models/user");

connectToDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 14 * 24 * 60 * 60,
    }),
};
app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
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
