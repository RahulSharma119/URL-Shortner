const User = require('../models/user');
const jwt  =require('jsonwebtoken');
const shortid = require('shortid');
const shortUrls = require('../models/shortUrls');

exports.signup = (req,res) => {
    // console.log(req.body);
    User.findOne({ email: req.body.email }).exec(async (error,user) => {
        if(user){
            return res.status(500).json({ message: "User already exists" });
        }
        if(error){
            return res.status(400).json({message: error});
        }
        const { firstName, lastName, email, password } = req.body;
        // console.log(firstName, lastName,email,password);
        const _user = new User({
            firstName: firstName,
            lastName: lastName,
            password: password,
            email: email,
            userName : shortid.generate()
        });
        _user.save((error,data) => {
            if(error){
                return res.status(400).json({message: error});
            }
            if(data){
                return res.status(200).json({message: "User created successfully"});
            }
        });
    });
};


exports.signin = (req,res) => {
    // console.log(req);
    if(req.body.token){
        const token = req.body.token;
        const user = jwt.verify(token,"jwt_secret_key");
        User.findOne({_id:user._id}).exec(async (error,user) => {
            if(error){
                return res.status(400).json({"error": error});
            }
            if(user){
                return res.status(200).json({
                    "email": user.email,
                    "token": token
                });
            }
        })
        // req.user = user;
    }
    else{
        User.findOne({ email: req.body.email })
        .exec((error,user) => {
            if(error){
                return res.status(400).json({ message: error });
            }
            if(user){
                if(user.authenticate(req.body.password)){
                    const token = jwt.sign({ _id: user._id,
                        fullname: user.fullname
                    },'jwt_secret_key',{ expiresIn: '1d' });
                    const { _id, firstName, lastName, email, fullName } = user;
                    res.status(200).json({
                        token,
                        user : {
                            _id,
                            firstName,
                            lastName,
                            email,
                            fullName
                        }
                    });
                }
                else{
                    return res.status(500).json({ message: "Invalid Password" });
                }
            }
            else{
                return res.status(400).json({ message: "Something went wrong", error: error, user: user })
            }
        });
    }
    
}

exports.requestData = (req,res) => {
    // console.log(req.body.token);
    if(req.body.token){
        const token = req.body.token;
        const user = jwt.verify(token,"jwt_secret_key");
        // console.log(user);
        User.findOne({_id:user._id}).select("_id userName").exec(async (error,user) => {
            if(error){
                return res.status(400).json({"error": error});
            }
            else if(user){
                // console.log(user);
                shortUrls.find({ user: {_id: user._id} }).select("_id short full clicks").exec((err,data) => {
                    if(err){
                        return res.status(500).json({"message": "error retriving data"});
                    }
                    else if(data){
                        // console.log(data);
                        return res.status(200).json(data);
                    }
                });
            }
        });
    }
    else{
        return res.status(400).json({"message": ""})
    }
    
};

exports.storeUrl = async (req,res) => {
    // console.log(req.body);
    if(req.body.token){
        const token = req.body.token;
        const user = jwt.verify(token,"jwt_secret_key");
        User.findOne({_id:user._id}).select("_id userName").exec(async (error,user) => {
            if(error){
                return res.redirect('/signin');
            }
            else if(user){
                // console.log(user);
                // shortUrls.create({full : req.body.fullurl, user: {_id: user._id}}).exec((err,data) => {
                //     if(err){
                //         return res.status(500).json({"message": "could not shorten url"});
                //     }
                //     else if(data){
                //         console.log(data);
                //         return res.status(200).json(data);
                //     }
                // });

                shortUrls.findOne({ full: req.body.fullurl, user: {_id: user._id} }).select("_id short full clicks").exec((err,data) => {
                    if(err){
                        return res.status(500).json({"message": "could not shorten url"});
                    }
                    else if(data && data._id){
                        return res.status(400).json({"message": "Url Already exists"});
                    }
                    else{
                        const short = new shortUrls({
                            full: req.body.fullurl,
                            user: user._id
                        });
                        short.save(((err,short) => {
                            if(err){
                                return res.status(500).json({"message": "could not shorten url"});
                            }
                            if(short){
                                return res.redirect('/');
                            }
                        }))
                    }
                });
            }
            else{
                return res.status(500).json({"message": "Error Could not signin"});
            }
        });
    }
    else{
        console.log("signin");
        return res.redirect('/signin');
    }
} 
