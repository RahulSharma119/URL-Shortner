const express = require('express');
const path = require('path');
const { signup } = require("../../Controller/auth")

const router = express.Router();

router.get('/signup',function (req,res) {
    res.sendFile(path.join(__dirname,'../../views/signup.html'));
});

router.post('/signup/submit',signup);

module.exports = router;