const pool = require('../database/pool.js');

const getProfile = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM users RIGHT JOIN recipes ON users.id = recipes.userid WHERE userid = $1", [req.user.id]);

    res.render('profile', { 
        user: req.user,
        username: req.user.username, 
        firstName: req.user.firstname,
        lastName: req.user.lastname,
        email: req.user.email,
        phone: req.user.phone,
        status: req.user.status,
        rows: rows
    });
};  

const disableProfile = async (req, res) => {
    try {
        await pool.query("UPDATE users SET status = 'disabled' WHERE username = $1 AND email = $2", [req.user.username, req.user.email]);
        return res.redirect("/logout");
    } catch(err) {
        console.log("ERROR CAUGHT");
        console.error(err);
    }

    res.redirect("/");
};

const deleteProfile = async (req, res) => {
    try {
        await pool.query("UPDATE users SET status = 'deleted' WHERE username = $1 AND email = $2", [req.user.username, req.user.email]);
        return res.redirect("/logout");
    } catch(err) {
        console.log("ERROR CAUGHT");
        console.error(err);
    }

    res.redirect("/");
};

const enableProfile = async(req, res) => {
    try {
        await pool.query("UPDATE users SET status = 'active' WHERE username = $1 AND email = $2", [req.user.username, req.user.email]);
        return res.redirect("/logout");
    } catch(err) {
        console.log("ERROR CAUGHT");
        console.error(err);
    }

    res.redirect("/profile");    
}

module.exports = { getProfile, disableProfile, deleteProfile, enableProfile };