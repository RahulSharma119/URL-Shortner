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

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({extended : false}))
app.use(express.json());

// app.get('/',async (req,res) => {
//     const shortUrls = await ShortUrl.find()
//     res.render('index.ejs',{urls : shortUrls});
// });

app.use(homeRoute);

app.use(signinRoute);
app.use(signupRoute);

// app.get('/signin',async (req,res) => {
//     res.render('signin.ejs');
// });
// app.post('/signin/check',async (req,res) => {
//     console.log(req.body);
//     return signin(req,res);
// })

// app.post('/shortenUrl',async (req,res) => {
    
//     await ShortUrl.create({full : req.body.fullurl});
//     res.redirect('/');
// });

app.get('/:shortUrl',async (req,res)=>{
    // console.log(req.params.shortUrl);
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl});
    if(shortUrl == null){
        return res.sendStatus(404);
    }
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
});


app.listen(process.env.POPT || 8000);
