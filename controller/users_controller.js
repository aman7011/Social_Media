const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: "Codeial",
            profile_user: user
        });
    });
}
// where is err??
// adding comment refreshing page 
// delete to comment is also not showing

// ok bro

module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('********Multer Error:', err); return;}
                
                user.name = req.body.name;
                user.email = req.body.email;

                console.log('req.body',req.body);
                console.log('req.file', req.file)

                if(req.file){
                    if(user.avatar ){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath+'/'+ req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error', "Unauthorized");
            return res.status(401).send('Unauthorized');
        }
    }else{
        req.flash('error', "Unauthorized");
        return res.status(401).send('Unauthorized');
    }
}

//render signup page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

//render sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

//get the sign up data
module.exports.create = function(req, res){
    if(req.body.password!=req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return;}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return;}

                return res.redirect('/users/sign-in');
            });         
        }else{
            req.flash('error', 'User Already Exists');
            return res.redirect('back');
        }
    });
}

//sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have Logged Out!');
    return res.redirect('/');
}