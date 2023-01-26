const mongoose = require('mongoose');

let trackSchema = new mongoose.Schema({
    track: String,
    artist: String,
    imageUrl: String,
    ratedBy: [
        {
            user: {
                userID: String,
                email: String,
                username: String,
            },
            starRating: Number,
        },
    ],
});

const Track = mongoose.model("track", trackSchema);

module.exports = Track;