const express = require('express');
const app = express();

const path = require('node:path');
const session = require('express-session');
const passport = require('./config/passportConfig.js'); //passport configuration

// Set up view engine to use ejs template files 
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs'); 

// Set up public directory to serve static assets like .css files
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Set up to use favicon
const favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
 
app.use(
    session({ 
        secret: crypto.randomUUID(), 
        resave: false, 
        saveUninitialized: false 
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

// Set up express router for each page (makes it easier to read this file and other files and group together code)
const { welcomeRouter } = require('./routes/welcomeRouter.js');
const { registerRouter } = require('./routes/registerRouter.js');
const { loginRouter } = require('./routes/loginRouter.js');
const { contactRouter } = require('./routes/contactRouter.js');

app.use('/', welcomeRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/contact', contactRouter);

// authenticated routes only (else redirect to home/about page)
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

const { dashboardRouter} = require('./routes/dashboardRouter.js');
const { profileRouter } = require('./routes/profileRouter.js');
const { recipesRouter } = require('./routes/recipesRouter.js');

app.use('/dashboard', ensureAuthenticated, dashboardRouter);
app.use('/profile', ensureAuthenticated, profileRouter);
app.use('/recipes', ensureAuthenticated, recipesRouter);


// logout route 
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }

        res.redirect('/');
    });
});

//default for invalid URLs being visited
app.use("*", (req, res) => res.redirect("/"));


// error middleware, mainly used for invalid register or login requests
app.use((err, req, res, next) => {
    console.log(err.message);
    if(err.message === "Invalid Credentials.") {
        const error = { msg: err.message };
        res.render('login', { errors: [error] });
    } else {
        const error = { msg: err.message };
        res.render('register', { errors: [error] });
    }

    next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started listening on http://localhost:${port}`);
});