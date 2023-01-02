const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const connectDB = require('./server/database/connection');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Load config.
dotenv.config({ path: 'config.env' });

// Passport config.
require('./assets/js/passport')(passport);

const PORT = process.env.PORT || 8080;

const generalRouter = require('./server/routes/generalRouter');
const authRouter = require('./server/routes/authRouter');

// MongoDB connection.
connectDB();

// Log requests.
app.use(morgan("dev"));

// Parse requests to body-parser.
app.use(bodyparser.urlencoded({ extended: true }));

// Set view engine.
app.set("view engine", "ejs");

// Load assets.
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));

// Parses JSON data into JavaScript object.
app.use(express.json());

app.use(cookieParser());

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

// Passport middleware.
app.use(passport.initialize());
app.use(passport.session());

// Load routers.
app.use(generalRouter);
app.use(authRouter);

app.listen(3000, ()=> { console.log(`Server is running on http://localhost:${PORT}`) });