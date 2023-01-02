const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Handle errors.
const handleErrors = (error) => {
    console.log(error.message, error.code);
    let errors = {email: '', username: '', password: ''};
    // Incorrect email.
    if (error.message === 'Incorrect email.') {
        errors.email = 'That email is not registered.';
    }
    // Incorrect password.
    if (error.message === 'Incorrect password.') {
        errors.password = 'That password is incorrect.';
    }
    // Duplicate error code.
    if (error.code === 11000) {
        errors.email = 'That email is already registered.';
        return errors;
    }
    // Validation errors.
    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

// For JWT Tokens.

const maxAge = 3 * 24 * 60 * 60; // 3 days.

const createToken = (id) => {
    return jwt.sign({ id }, 'playlistify secret', {
        expiresIn: maxAge
    });
}

module.exports.index = (req, res) => {
    res.render('index');
}

module.exports.register_get = (req, res) => {
    res.render('register');
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports.register_post = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.create({ email, username, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.profile = (req, res) => {
    res.render('profile');
}

module.exports.google_callback_get = async (req, res) => {
    /* Create cookie so that google authenticate user can pass the authMiddleware check 
    before going into protected page '/profile'. */
    const token = createToken(req.user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect('/profile');
}