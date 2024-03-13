function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You need to login first!");
        return res.redirect("/signin");
    }
    next();
}

function storeReturnTo(req, res, next) {
    res.locals.returnTo = req.session.returnTo;
    next();
}

const { Equipment, UnsavedEquipment } = require("./models/equipment");
const DraftEquipment = require("./models/draftEquipment");

async function hasRights(req, res, next) {
    const { id } = req.params;
    const { view } = req.query;
    let equipment = {};
    try {
        if (view == "draft") {
            equipment = await DraftEquipment.findById(id);
        } else if (view == "saved") {
            equipment = await Equipment.findById(id);
        } else if (view == "unsaved") {
            equipment = await UnsavedEquipment.findById(id);
        }
        if (
            equipment.user._id.toString() == req.user._id.toString() ||
            req.user.role == "moderator" ||
            req.user.role == "administrator"
        ) {
            return next();
        }
    } catch {
        return res.status(403).send("Unauthorised access");
    }

    return res.status(403).send("Unauthorised access");
}

module.exports = { isLoggedIn, storeReturnTo, hasRights };
