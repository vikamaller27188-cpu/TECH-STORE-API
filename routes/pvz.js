const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/", (req, res, next) => {
    try {
        const pvz = db.prepare("SELECT * FROM pvz ORDER BY city, address").all();
        res.json(pvz);
    } catch (err) {
        next(err);
    }
});

module.exports = router;