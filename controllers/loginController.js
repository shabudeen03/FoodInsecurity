const { body, validationResult } = require('express-validator');

const validator = [
    body('uename').trim()
        .isAlphanumeric().withMessage("Please enter only valid username"),

    body('passwd').trim()
        .isLength({ min: 8 }).withMessage("Password must be minimum 8 characters")
];

const getLogin = (req, res) => {
    res.render("login", { errors: [] });
};
 
const postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        // console.log(errors.array()); 
        return res.render("login", { errors: errors.array() });
    } 
    
    next();
};

module.exports = { getLogin, validator, postLogin };