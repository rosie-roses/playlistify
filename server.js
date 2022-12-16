const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');

// Log requests.
app.use(morgan("dev"));

// Parse requests to body-parser.
app.use(bodyparser.urlencoded({ extended: true }));

// Load assets.
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));

// Set view engine.
app.set("view engine", "ejs");

app.use(express.json());

app.get("/", (req, res) => {
    res.render('index');
})

app.listen(3000, ()=> { console.log(`Server is running on http://localhost:${PORT}`) });