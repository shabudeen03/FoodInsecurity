const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require("../database/pool.js");

passport.use(
    new LocalStrategy(
    {
        usernameField: 'uename',
        passwordField: 'passwd'
    },    
    async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1 AND status != 'deleted'", [username]);
            // console.log(rows);
            const user = rows[0];

            if(!user) {
                // return done(null, false, { message: "Incorrect Credentials"});
                return done(new Error('Invalid Credentials.'));
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                // return done(null, false, { message: "Incorrect Credentials"});
                return done(new Error('Invalid Credentials.'));
            }

            return done(null, user);
        } catch(err) {
            console.error(err);
            return done(err); 
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];

        done(null, user);
    } catch(err) {
        console.log(err);
        done(err);
    }
});

module.exports = passport;