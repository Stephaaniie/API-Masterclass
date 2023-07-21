const colors = require('colors');

const express = require('express');

const dotenv = require('dotenv');

const morgan = require('morgan');

const cookieParser = require('cookie-parser');

const fileupload = require('express-fileupload');

//const connectDB = require('./config/db');

const bootcamps = require('./routers/bootcamps');
const courses = require('./routers/courses');
const auth = require('./routers/auth');
const user = require('./routers/users');
const reviews = require('./routers/reviews');

const errorHandler = require('./middleware/errors');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

//connectDB();

app.use(express.json());

app.use(cookieParser());

app.use(errorHandler);

app.use(fileupload());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('api/v1/users', user);
app.use('api/v1/reviews', reviews);

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() =>
        process.exit(1)
    );
});