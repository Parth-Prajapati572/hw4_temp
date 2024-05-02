const mongoose = require('mongoose')
const Schema = mongoose.Schema

const watchlistSchema = new Schema({
    ticker: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }},{timestamp: true})

const Watchlist = mongoose.model('watchlist', watchlistSchema)
module.exports = Watchlist
