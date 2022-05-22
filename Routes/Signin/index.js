const express = require('express');
const path = require('path');
const { signin } = require("../../Controller/auth")

const router = express.Router();

router.get('/signin',function (req,res) {
    res.sendFile(path.join(__dirname,'../../views/signin.html'));
});

router.post('/signin/check',signin);

module.exports = router;