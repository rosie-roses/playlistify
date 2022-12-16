const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');

const app = express();

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

app.use(express.json());

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

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.listen(3000, ()=> { console.log(`Server is running on http://localhost:${PORT}`) });