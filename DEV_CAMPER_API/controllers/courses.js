const path = require('path');

const ErrorResponse = require('../utils/errorResponse');

const asyncHandler = require('../middleware/async');

const Course = require('../models/Course');

const Bootcamp = require('../models/Bootcamp');

exports.getCourses = asyncHandler( async(req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({success: true, count: courses.length, data: courses});
    }else{
        res.status(200).json(res.advancedResults);
    }
});

exports.getCourse = asyncHandler( async(req, res, next) => {
    const course = await Course.findById(req.params.id).populate({ path: 'bootcamp', select:'name description'});

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: course});
});

exports.addCourse = asyncHandler( async(req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({ path: 'bootcamp', select:'name description'});

    if (!bootcamp) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`),401);
    }
    const course = await Course.create(req.body);

    res.status(200).json({success: true, data: bootcamp});
});

exports.updateCourse = asyncHandler( async(req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this course`),401);
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true
    });
    res.status(200).json({success: true, data: course});
});

exports.bootcampPhotoUpload = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){ return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))}

    if(!req.files) {return next(new ErrorResponse(`Please upload a file`,400));}

    const file = req.files.file;

    if(!file.mimetype.startsWith('image')){return next(new ErrorResponse(`Please upload an image file`,400));}

    if(file.size > process.env.MAX_FILE_UPLOAD){return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400));}

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`,500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id,{ photo: file.name});
        res.status(200).json({success: true, data: file.name})
    });
});

exports.deleteCourses = asyncHandler(async(req, res, next) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}}`,404));
    }
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete course`),401);
    }
    course.remove();
    res.status(200).json({success:true, data: course});
});