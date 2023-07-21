const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Plase add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Plase add rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

ReviewSchema.index(
    {
        bootcamp:1,
        user:1
    },
    {
        unique: true
    }
);

ReviewSchema.statics.getAverageRating= async function(bootcampId) {
    const obj= await this.aggregate([
    {
        $match: {bootcamp: bootcampId}
    },
    {
        $group: {
            _id: '$bootcamp',
            averageRating: { $avg: '$rating'}
        }
    }
])}

module.exports = mongoose.model('Review', ReviewSchema);