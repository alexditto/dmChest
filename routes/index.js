const express = require('express');
const router = express.Router();

//GET /
router.get('/', (req, res, next) => {
    return res.render('index', { title: "Home" });
});

module.exports = router;