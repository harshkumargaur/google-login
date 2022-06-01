require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const ejs = require('ejs');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user.model');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// let currentUser;
// console.log(currentUser);

/*
this function will protect the routes from unauthorized access
*/

const protect = async function(req,res,next){
    try {
        if(req.user){
            const user = await User.findOne({email:req.user.email});
            if (!user) {
                throw new Error('you must register first')
                
            }
            next();

        }else{
            throw new Error('must be logged in')
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})
app.use(session({
    secret: process.env.KEY1,
    store: store,
    resave: false,
    saveUninitialized: true
}))

store.on('error', (error) => console.log(error));


app.use(passport.initialize());
app.use(passport.session())
app.use(passport.authenticate('session'));

passport.serializeUser(function (profile, done) {
    return done(null, profile)
});
passport.deserializeUser(function (profile, done) {
    return done(null, profile);
});



const verify = async function (accessToken, refreshToken, profile, cb) {

    const { displayName, emails, photos, provider } = profile;


    try {
        const loggingInUser = await User.findOne({ email: emails[0].value });
        // console.log(loggingInUser);
        if (!loggingInUser) {
            const user = new User({
                name: displayName,
                email: emails[0].value,
                photo: photos[0].value,
                provider: provider
            })
            console.log(user);
            const newUser = await user.save();
            // currentUser = newUser;
            app.locals.currentUser = currentUser;

            return cb(null, newUser);
            ///// returned value will be stored in req.session  
        }

        if (loggingInUser) {
            // currentUser = loggingInUser;
            app.locals.currentUser = loggingInUser;

            return cb(null, loggingInUser);
        }


    } catch (error) {
        console.log(error);
    }
}

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/auth/google/callback'
}, verify));




app.get('/', (req, res) => {
    res.status(200).render('home', { title: 'Home' });
})


app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    console.log('entered');
    req.user = req.session.passport.user;
    // console.log(req.user);
    res.redirect('/secret');
});

app.get('/secret', protect, (req, res) => {
    res.render('secret', { title: 'secret' })
})

app.get('/test', (req, res) => {
    console.log(req.user);
    res.render('testing', { title: 'testing' })
})

app.get('/logout', (req, res) => {
    req.user = null;
    app.locals.currentUser= null;
    req.logout((err) => {
        if (err) {
            console.log(err);
        }

        res.redirect('/');
    });
})

app.all('*', (req, res) => {
    res.status(404).send('path not exists');
})

module.exports = app;