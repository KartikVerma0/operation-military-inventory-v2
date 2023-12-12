const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const indexPageData = require("./public/json/indexPage.json");
const fulldata = require("./public/json/data.json");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { categories: indexPageData["categories"] });
});

app.get("/blog", (req, res) => {
  res.render("blog", { title: "Blogs" });
});

app.get("/team", (req, res) => {
  res.render("team", { title: "Team" });
});

app.get("/feedback", (req, res) => {
  res.render("feedback_page", { title: "Feedback" });
});

app.get("/contact", (req, res) => {
  res.render("contact_page", { title: "Contact Us" });
});

app.get("/signIn", (req, res) => {
  res.render("sign_in_page", { title: "Sign In" });
});

app.get("/equipments/:service", (req, res) => {
  const { service } = req.params;
  switch (service) {
    case "IA":
      res.render("servicePage", {
        title: "Indian Army Equipments",
        fulldata,
        service,
      });
      break;
    case "IAF":
      res.render("servicePage", {
        title: "Indian Airforce Equipments",
        fulldata,
        service,
      });
      break;
    case "IN":
      res.render("servicePage", {
        title: "Indian Navy Equipments",
        fulldata,
        service,
      });
      break;
    default:
      res.render("404 - Page Not Found", {
        title: "404 - Page Not Found",
      });
      break;
  }
});

app.get("/equipments/:service/category/:category", (req, res) => {
  const { service, category } = req.params;
  res.render("categoryPage", {
    title: category,
    service,
    fulldata,
  });
});

app.get("/equipments/:service/:category/:equipment", (req, res) => {
  const { service, category, equipment } = req.params;
  res.render("equipment", { service, category, title: equipment, fulldata });
});

app.get("*", (req, res) => {
  res.render("404 - Page Not Found", { title: "404 - Page Not Found" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
