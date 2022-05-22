const express = require('express');
const path = require('path');
const { requestData, storeUrl } = require("../../Controller/auth");

const router = express.Router();


router.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'../../views/index.html'));
});
router.post('/getdata',requestData);

router.post('/shortenUrl',storeUrl);


module.exports = router;