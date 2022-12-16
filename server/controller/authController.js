module.exports.register_get = (req, res) => {
    res.render('register');
}

module.exports.register_post = (req, res) => {
    res.send("Create new user.");
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = (req, res) => {
    res.send("Logged existing user.");
}