'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Photo Schema
 */
var ExifSchema = new Schema({
    Make: {
        type:String
    },
    Model: {
        type:String
    },
    DateTimeOriginal: {
        type:String
    },
    ApertureValue: {
        type:String
    },
    FocalLength: {
        type:String
    },
    ISOSpeedRatings: {
        type:String
    },
    ExposureTime: {
        type:String
    },
    GPSLatitude: {
        type:String
    },
    GPSLongitude: {
        type:String
    },
    ImageDescription: {
        type:String
    }
});

mongoose.model('Exif', ExifSchema);