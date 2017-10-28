const passport = require('passport');
const registerUser = (req, res, next) => {
    req.checkBody('email', 'Invalid postparam').notEmpty();
    req.checkBody('email', 'Email should be email').isEmail();
    req.checkBody('password', 'Invalid postparam').notEmpty();
    req.checkBody('password', 'Invalid password length').len(6,40);
    req.checkBody('name', 'Invalid postparam').notEmpty();
    req.checkBody('surname', 'Invalid postparam').notEmpty();
    req.checkBody('phone', 'Invalid postparam').notEmpty();
    req.checkBody('address', 'Invalid postparam').notEmpty();
    req.checkBody('zipcode', 'Invalid postparam').notEmpty();

    req.getValidationResult()
        .then((result)=>{
            if(!result.isEmpty()){
                res.status(400).json(result.array());
            }else{
                return passport.authenticate('local-signupVolunteer', (err) => {
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
                return passport.authenticate('local-loginVolunteer', (err, token, userData) => {
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

module.exports = {registerUser, loginUser};