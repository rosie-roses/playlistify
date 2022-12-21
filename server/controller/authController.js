const User = require('../model/User');

// Handle errors.
const handleErrors = (error) => {
    console.log(error.message, error.code);
    let errors = {email: '', username: '', password: ''};

    // Duplicate error code.
    if (error.code === 11000) {
        errors.email = "That email is already registered.";
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

module.exports.register_get = (req, res) => {
    res.render('register');
}

module.exports.register_post = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.create({ email, username, password});
        res.status(201).json(user);
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
    res.send("Logged existing user.");
}