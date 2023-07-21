const express = require('express');

const {
    getBootcamp,
    getBootcamps,
    getBootcampsInRadius,
    createBootcamps,
    updateBootcamps,
    deleteBootcamps,
    bootcampPhotoUpload
} = require('../controllers/bootcampsController');

const courseRouter = require('./courses');

const reviewRouter = require('./reviews');

const advancedResults = require('../middleware/advancedResults');

const Bootcamp = require('../models/Bootcamp');

const router = express.Router();

const { protect, authorize} = require('../middleware/auth');

router.use('/:bootcampId/courses', courseRouter);

router.use('/:bootcampId/review', reviewRouter);

router
    .route('/:id/photo')
    .put(protect, authorize('publisher, admin'), bootcampPhotoUpload);

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);
    
router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher, admin'), createBootcamps);

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher, admin'), updateBootcamps)
    .delete(protect, authorize('publisher, admin'), deleteBootcamps)
    
module.exports = router;