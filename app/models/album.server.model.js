'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Photo Schema
 */
var AlbumSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String,
        default: '',
        trim: true
    },
    name: {
        type:String
    },
    prettyName: {
        type: String
    },
    url: {
        type: String
    },
    path: {
        type: String
    },
    thumb: {
        type: String
    },
    hash: {
        type:String
    },
    photos: [{
        type: Schema.ObjectId,
        ref: 'Photo'
    }],
    parent:{
        type: Schema.ObjectId,
        ref: 'Album'
    },
    childs: [{
        type: Schema.ObjectId,
        ref: 'Album'
    }],
    users: [{
        type: Schema.ObjectId,
        ref: 'User'
    }]
});

var AlbumModel = mongoose.model('Album',AlbumSchema);

AlbumSchema.pre('save', function (next) {
    var self = this;
    AlbumModel.find({name : self.name}, function (err, album) {
        if (!album.length){
            next();
        }
    });
});

AlbumSchema.post('save', function (next) {
    var self = this;
    if(self.parent){
        AlbumModel.findByIdAndUpdate(self.parent, {$addToSet: {childs: self._id}}, function(err, parent) {
            if (err) return console.log('contact addMsg error: ' + err);
            console.log('################ parent album ############');
            console.log(parent.name);
        });
    }
}) ;

mongoose.model('Album', AlbumSchema);