const mongoose = require('mongoose');

const courtScema = new mongoose.Schema({
    courtNumber: { type: Number, required: true },
    player1: { type: String, required: true },
    player2: { type: String, required: true },
    player3: { type: String, required: false },
    player4: { type: String, required: false },
    playing: Boolean,
    set1: { type: String, required: false },
    set2: { type: String, required: false },
    set3: { type: String, required: false },
    set4: { type: String, required: false },
    set5: { type: String, required: false },
    set6: { type: String, required: false },
    tiebreaker: { type: String, required: false }

});

const Court = mongoose.model('Court', courtScema);

module.exports = Court;
