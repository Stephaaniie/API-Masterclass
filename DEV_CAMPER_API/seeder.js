const fs = require('fs');

const mongoose = require('mongoose');

const colors = require('colors');

const dotenv = require('dotenv');

dotenv.config();

const Bootcamp = require('./models/Bootcamp');

const Course = require('./models/Course');

const User = require('./models/User');

const Review = require('./models/Review');

const URI = process.env.MONGO_URI;

mongoose.connect( URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/data/boocamps.json`, 'utf-8'));

const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`,'utf-8'));

const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`,'utf-8'));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`,'utf-8'));

const importData = async () => {
    try {
        await Bootcamp.create(bootcamp);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);
        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}