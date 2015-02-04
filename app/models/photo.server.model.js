'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),

	Exif = mongoose.model('Exif'),
    Schema = mongoose.Schema;

	var ExifImage = require('exif').ExifImage;
/**
 * Photo Schema
 */
var PhotoSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.ObjectId,
        ref: 'Comments'
    }],
    name: {
        type: String
    },
    prettyName: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    path: {
        type: String
    },
    thumbPath: {
        type: String
    },
    parent:{
        type: Schema.ObjectId,
        ref: 'Album'
    },
    users: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    exif:{
        type: Schema.ObjectId,
        ref: 'Exif'
    }
});

var PhotoModel = mongoose.model('Photo',PhotoSchema);

var AlbumModel = mongoose.model('Album');

PhotoSchema.pre('save', function (next) {
    var self = this;
    PhotoModel.find({name : self.name}, function (err, photos) {
        if (!photos.length){
            next();
        }
    });
});

PhotoSchema.post('save', function (next) {
    var self = this;
    if(self.parent){
        AlbumModel.findByIdAndUpdate(self.parent, {$addToSet: {photos: self._id}}, function(err, parent) {
            if (err) return console.log('contact addMsg error: ' + err);
        console.log('$$$$$$$$$$$$$$$   photo parent album $$$$$$$$$$$$$$$');
        console.log(parent);
        });
    }
}) ;

mongoose.model('Photo', PhotoSchema);