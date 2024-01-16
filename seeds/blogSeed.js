const mongoose = require("mongoose");
const Blog = require("../modals/blogSchema");

mongoose
    .connect("mongodb://localhost:27017/opMilInv")
    .then(() => {
        console.log("Database Connection Established");
    })
    .catch(() => {
        console.log("Problem connecting to database");
    });

async function seedBlog() {
    await Blog.insertMany([
        {
            headline:
                "S-400 squadron deployed; Here's how it will bolster India's air defence",
            articleURL:
                "https://www.hindustantimes.com/videos/news/s400-squadron-deployed-here-s-how-it-will-bolster-india-s-air-defence-101640082708739.html",
            thumbnailURL: "images/s400-min.png",
            publishedDate: new Date("Dec 21, 2021"),
            author: "Admin",
        },
        {
            headline:
                "DRDO tests Agni P missile for second time, can hit targets at 2,000 km",
            articleURL:
                "https://www.hindustantimes.com/india-news/drdo-tests-agni-p-missile-for-second-time-can-hit-targets-at-2-000-km-101639837389623.html",
            thumbnailURL: "images/agni-min.jpg",
            publishedDate: new Date("Dec 18, 2021"),
            author: "Admin",
        },
        {
            headline:
                "Indigenously developed next-generation AERVs inducted into Army",
            articleURL:
                "https://economictimes.indiatimes.com/news/defence/indigenously-developed-next-generation-aervs-inducted-into-army/articleshow/88417257.cms",
            thumbnailURL: "images/aerv-min.jpg",
            publishedDate: new Date("Dec 21, 2021"),
            author: "Admin",
        },
        {
            headline:
                "DRDO’s helicopter-launched SANT missile precisely strikes target",
            articleURL:
                "https://www.hindustantimes.com/videos/news/watch-drdo-s-helicopter-launched-sant-missile-precisely-strikes-target-101639236838762.html",
            thumbnailURL: "images/sant-min.jpg",
            publishedDate: new Date("Dec 11, 2021"),
            author: "Admin",
        },
        {
            headline:
                "Boost for Army | Enhanced range Pinaka rocket launcher system successfully",
            articleURL:
                "https://www.hindustantimes.com/videos/news/boost-for-army-enhanced-range-pinaka-rocket-launcher-system-successfully-101639216004816.html",
            thumbnailURL: "images/pinaka-min.jpg",
            publishedDate: new Date("Dec 11, 2021"),
            author: "Admin",
        },
        {
            headline: "Boost for Indian Navy; VL-SRSAM test-fired successfully",
            articleURL:
                "https://www.hindustantimes.com/videos/news/boost-for-indian-navy-vl-srsam-test-fired-successfully-watch-101638929505443.html",
            thumbnailURL: "images/vlsrsam-min.jpg",
            publishedDate: new Date("Dec 08, 2021"),
            author: "Admin",
        },
        {
            headline:
                "India successfully test-fires air version of BrahMos supersonic cruise missile",
            articleURL:
                "https://www.hindustantimes.com/india-news/india-successfully-test-fires-air-version-of-brahmos-supersonic-cruise-missile-101638948833256.html",
            thumbnailURL: "images/brahmos-min.jpg",
            publishedDate: new Date("Dec 08, 2021"),
            author: "Admin",
        },
        {
            headline: "Why India wants Russian-origin AK-203 assault rifles",
            articleURL:
                "https://www.hindustantimes.com/videos/news/watch-why-india-wants-russian-origin-ak-203-assault-rifles-key-details-101638857621467.html",
            thumbnailURL: "images/ak203-min.jpg",
            publishedDate: new Date("Dec 07, 2021"),
            author: "Admin",
        },
        {
            headline:
                "India will soon build ships for the world: Rajnath Singh after commissioning INS Visakhapatnam",
            articleURL:
                "https://www.hindustantimes.com/india-news/in-a-boost-to-indian-navy-rajnath-singh-commissions-ins-visakhapatnam-101637475441593.html",
            thumbnailURL: "images/ins-min.jpg",
            publishedDate: new Date("Nov 21, 2021"),
            author: "Admin",
        },
    ]);
}

seedBlog();

mongoose
    .disconnect()
    .then(() => {
        console.log("Disconnected from MongoDB");
    })
    .catch((err) => {
        console.error("Error disconnecting from MongoDB:", err);
    });
