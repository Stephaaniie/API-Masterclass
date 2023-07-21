const ErrorResponse = require('../utils/errorResponse');

const asyncHandler = require('../middleware/async');

const geocoder = require('../utils/geoCoder');

const Bootcamp = require('../models/Bootcamp');

exports.getBootcamps = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.getBootcamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}}`,404));
    }
    res.status(200).json({success: true, data: bootcamp});
});

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    const loc = await geocoder.geocoder(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = distance / 3963;

    const boocamps = await Bootcamp.find({
        location: {$geoWithin: { $centerSphere: [[lng, lat], radius]}}
    });
    res.status(200).json({success: true, count: boocamps.length, data: boocamps});
});

exports.createBootcamps = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    
    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id });

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({success: true, data: bootcamp});        
});

exports.updateBootcamps = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}}`,404));
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`),401);
    }
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({success:true, data: bootcamp});
});

exports.deleteBootcamps = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}}`,404));
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`),401);
    }
    bootcamp.remove();
    res.status(200).json({success:true, data: bootcamp});
});
