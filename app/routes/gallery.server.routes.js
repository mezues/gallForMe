'use strict';

module.exports = function(app){

var gallery = require('../../app/controllers/gallery.server.controller');

	app.route('/albumslist').post(gallery.albumlist);
	app.route('/albums/:albumId').get(gallery.getAlbums);
	app.route('/albums/').get(gallery.getAlbums);

	app.route('/album/addUser').put(gallery.addUserAlbum);
	app.route('/album/delUser').put(gallery.delUserAlbum);

	app.route('/photos/:albumId').get(gallery.getPhotos);
	app.route('/photos/').get(gallery.getPhotos);
	app.route('/photo/:photoId').get(gallery.getPhoto);
	app.route('/photo/addUser').put(gallery.addUserPhoto);
	app.route('/photo/delUser').put(gallery.delUserPhoto);
	app.route('/photoNext/:photoId').get(gallery.getNextPhoto);
	app.route('/photoPrev/:photoId').get(gallery.getPrevPhoto);
	app.route('/photoDownload/:photoId').get(gallery.downloadPhoto);
};
