const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('UserOrganisation');
const UserTemp = mongoose.model('UserOrganisationTemp');

const registerUser = (req, res, next) => {
    req.checkBody('email', 'Invalid postparam').notEmpty();
    req.checkBody('password', 'Invalid postparam').notEmpty();
    req.checkBody('password2', 'Invalid postparam').notEmpty();
    req.checkBody('name', 'Invalid postparam').notEmpty();
    req.checkBody('personname', 'Invalid postparam').notEmpty();
    req.checkBody('phone', 'Invalid postparam').notEmpty();
    req.checkBody('address', 'Invalid postparam').notEmpty();
    req.checkBody('zipcode', 'Invalid postparam').notEmpty();
    req.checkBody('city', 'Invalid postparam').notEmpty();
    req.checkBody('nip', 'Invalid postparam').notEmpty();
    console.log('[1]')
    req.getValidationResult()
        .then((result)=>{
            if(!result.isEmpty()){
                res.status(400).json(result.array());
            }else{
                return passport.authenticate('local-signupOrganisation', (err) => {
                    if (err) {
                        console.log(err)
                        if (err.name === 'MongoError' && err.code === 11000) {
                            return res.status(409).json({
                                success: false,
                                message: 'Nieprawidłowe parametry formularza.',
                                errors: {
                                    email: 'Email jest zajęty.'
                                }
                            });
                        }
                        if(err.name === "MailErr"){
                            return res.status(411).json({
                                success: false,
                                message: 'Błąd wysyłania wiadomości email'
                            });
                        }

                        if(err.num === 10){
                            return res.status(400).json({
                                success: false,
                                message: 'Nieprawidłowe parametry formularza.'
                            });
                        }
                    }
                    return res.status(200).json({
                        success: true,
                        message: 'Konto zostało założone. Aby je aktywować kliknij w link, który właśnie przesłaliśmy na Twoją skrzynkę e-mailową.'
                    });
                })(req, res, next);
            }
        });
};

const loginUser = (req, res, next) => {
    req.checkBody('email', 'Invalid postparam').notEmpty();
    req.checkBody('password', 'Invalid postparam').notEmpty();
    //TODO: complete checking above fields
    req.getValidationResult()
        .then((result)=>{
            if(!result.isEmpty()){
                res.status(400).json(result.array());
            }else{
                return passport.authenticate('local-loginOrganisation', (err, token, userData) => {
                    if (err) {
                        if (err.name === 'IncorrectCredentialsError') {
                            return res.status(400).json({
                                success: false,
                                message: err.message
                            });
                        }
                        console.log(err)
                        return res.status(400).json({
                            success: false,
                            message: 'Nieprawidłowe parametry.'
                        });
                    }

                    return res.json({
                        success: true,
                        message: 'Zostałeś zalogowany.',
                        token,
                        user: userData
                    });
                })(req, res, next);
            }
        });
};

const mailConfirmation = (req, res, next) => {
    req.checkParams('id', 'Invalid postparam').notEmpty();
    //TODO: complete checking above fields
    req.getValidationResult()
        .then((result)=>{
            if(!result.isEmpty()){
                res.status(400).json(result.array());
            }else{
                UserTemp.findById(req.params.id, (err, user)=>{
                    if(err) res.status(400).json({success:false, message: "Wrong mail."});
                    if(user) {
                        new User({
                            email: user.email,
                            password: user.password,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            zipcode: user.zipcode,
                            phone: user.phone,
                            address: user.address
                        }).save((err, newUser)=>{
                            UserTemp.findByIdAndRemove(req.params.id,(err)=>{
                                if(err) res.status(400).json({success:false, message: "Remove temp failed."})
                                res.redirect('http://localhost:8080');
                            });
                        });
                    }else{
                        res.status(400).json({success: false, message: "Wrong mail."})
                    }
                })
            }
        });
};


const changeUser = (req, res, next) => {
    req.checkBody('newContent', 'Invalid postparam').notEmpty();
    //TODO: complete checking above fields
    req.getValidationResult()
        .then((result)=>{
            if(!result.isEmpty()){
                res.status(400).json(result.array());
            }else{
                if(req.userId){
                    User.findByIdAndUpdate(req.userId, {
                        firstname: {$set: req.body.newContent.firstname},
                        lastname: {$set: req.body.newContent.lastname},
                        zipcode: {$set: req.body.newContent.zipcode},
                        phone: {$set: req.body.newContent.phone},
                        city: {$set: req.body.newContent.city},
                        address: {$set: req.body.newContent.address}
                    }, (err, user)=>{
                        if(err) res.status(400).json({success: false, message: "Failed to change user data."});
                        res.status(200).json({success: true});
                    })
                }
            }
        });
};

module.exports = {registerUser, loginUser, mailConfirmation, changeUser};