const pool = require('./pool.js');

async function getUser(username, password) {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE username=$1 AND password=$2", 
        [username, password]
    );

    const user = rows[0];
    return user;
}

module.exports =  { getUser };