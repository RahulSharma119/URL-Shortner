const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrls');
const app = express()
const signinRoute = require('./Routes/Signin/index');
const signupRoute = require('./Routes/Signup/index');
const homeRoute = require('./Routes/Home/index');

mongoose.connect('mongodb://localhost:27017/urlShortener',{
    useNewUrlParser : true , useUnifiedTopology : true
})

app.use(express.json());


app.use(homeRoute);

app.use(signinRoute);
app.use(signupRoute);

app.get('/:shortUrl',async (req,res)=>{
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl});
    if(shortUrl == null){
        return res.sendStatus(404);
    }
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
});


app.listen(process.env.POPT || 8000);
