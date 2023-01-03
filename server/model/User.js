const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email.']
    },
    username: {
        type: String,
        required: [true, 'Please enter an username.'],
    },
    password: {
        type: String,
        required: [true, 'Please enter an password.'],
        minlength: [6, 'Minimum password length is 6 characters.']
    },
    playlist: [
        {
            track: String,
            artist: String,
            rating: Number,
            imageUrl: String
        }
    ]
});

// Fire a function after document is saved to DB.
userSchema.post('save', function (doc, next) {
    console.log('New user was created and saved.', doc);
    next();
});

// Fire a function before document is saved to DB.
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to login user.
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
       const auth = await bcrypt.compare(password, user.password);
       if (auth) {
        return user;
       }
       throw Error('Incorrect password.');
    }
    throw Error('Incorrect email.');
}

const User = mongoose.model('user', userSchema);

module.exports = User;