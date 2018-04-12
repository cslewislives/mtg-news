const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: 'This Article already exists'
    },

    link: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    saved: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date
    },

    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

ArticleSchema.plugin(uniqueValidator);
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;