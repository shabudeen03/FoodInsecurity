const pool = require('../database/pool.js');

const getContact = (req, res) => {
    res.render('contact', { user: req.user });
};

const postContact = async (req, res) => {
    // console.log(req.body);
    try {
        await pool.query("INSERT INTO comms(title, text) VALUES ($1, $2)", [req.body.title, req.body.text]);
        return res.redirect("/");
    } catch(err) {
        console.error(err);
    }

    res.redirect("/contact");
}

module.exports = { getContact, postContact };