const { Router } = require('express');
const welcomeRouter = Router();


welcomeRouter.get("/", (req, res) => {
    res.render("welcome", { user: req.user });
});

// welcomeRouter.post("/", (req, res) => {
//     if(req.method === 'POST') return res.redirect("/");
//     res.render("welcome");
// });

module.exports = { welcomeRouter };