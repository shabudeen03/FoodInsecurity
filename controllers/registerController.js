const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const pool = require("../database/pool.js");

const validator = [
    body('fname').trim()
        .isAlpha().withMessage("First name must be valid."),

    body('lname').trim()
        .isAlpha().withMessage("Last name must be valid"),

    body('uname').trim()
        .isAlphanumeric().withMessage("Please enter only valid username"),

    body('email').trim() 
        .isEmail().withMessage("Please give a valid email"),

    body('cpass').trim()
        .isLength({ min: 8 }).withMessage("Password must be minimum 8 characters"),

    body('repass').trim()
        .isLength({ min: 8 }).withMessage("Password must be minimum 8 characters")
];

const getRegister = (req, res) => {
    res.render("register", { errors: [] });
};

const postRegister = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        res.render("register", { errors: errors.array() });
    } else {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1 OR (email = $2 AND status != 'deleted')", [req.body.uname, req.body.email]);
            if(rows.length > 0) {
                if(rows[0].email === req.body.email) throw "Email already in use. Please use another email";
                else throw "Username taken. Please use another username.";
            }

            const hashedPwd = await bcrypt.hash(req.body.cpass, 10);
            await pool.query(
                "INSERT INTO users(username, firstname, lastname, email, password, status) VALUES ($1, $2, $3, $4, $5, $6)", 
                [req.body.uname, req.body.fname, req.body.lname, req.body.email, hashedPwd, "active"]
            );

            res.redirect("/");
        } catch(err) {
            // console.error(err);
            return next({ message: err });
        }  
    } 
};

module.exports = { getRegister, postRegister, validator };