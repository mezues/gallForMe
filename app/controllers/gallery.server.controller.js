'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Photo = mongoose.model('Photo'),
	Album = mongoose.model('Album'),
	User = mongoose.model('User'),
	Exif = mongoose.model('Exif'),
	fs = require('fs'),
	path = require('path'),
	gm = require('gm'),
	config = require('../../config/config'),
	ExifImage = require('exif').ExifImage;

	var resources = config.resources;
	var shortPhotoDir = config.photoDir;
	var shortThumbDir = config.thumbDir;
	var fullPhotoDir = path.join(resources ,shortPhotoDir);
	var fullThumbDir = path.join(resources, shortThumbDir);

function handleError(err){
	console.log(err);
}

function crop_image(srcPath, dstPath){
	gm(srcPath)
		.resize(1000, 1000)
		.autoOrient()
		.write(dstPath, function(err){
			if (err)
				handleError(err);
		});
}

exports.albumlist = function(req, res){

	var files = [];
	var photoFiles = [];
	var filter = /^Thumbs.db|^\.[a-zA-Z0-9]+/;
	var walk = require('walk');
	var walker  = walk.walk(fullPhotoDir, { followLinks: false });

	walker.on('directories', function (root, dirStatsArray, next) {
		next();
	});

	walker.on('file', function(root, stat, next) {
		if (stat.name.match(filter) !== null){
			next();
		}

		// Make the reference to the root photo have no ref to this.directory
		var user = req.user;
		if(user){
			var rootlessRoot = root.replace(fullPhotoDir + '/', '');
			rootlessRoot = rootlessRoot.replace(fullPhotoDir, '');
			if (user.roles.indexOf('admin') > -1){
				var file = {
					type: stat.type,
					name: stat.name,
					rootDir: rootlessRoot
				};
				if(file.name.split('.').pop().toLowerCase()==='jpg'||
					file.name.split('.').pop().toLowerCase()==='png'){
					files.push(file);
					photoFiles.push(file);
				}
			}
		}
		next();
	});

	walker.on('end', function() {

		var mainAlbumName = 'Angular Photo Gallery';

		function createAlbum(files, mainAlbum, dirs, parent, currentAlbumPath){

			var dir = dirs.shift();
			if (dir !== ''){
				currentAlbumPath += currentAlbumPath + '/' + dir;

				Album.findOne({name:dir}, function(err, album){
					if(err)
						handleError(err);
					if(!album){
						var newdbAlbum = new Album({
							name: dir,
							prettyName: decodeURIComponent(dir),
							description: '',
							path: currentAlbumPath,
							url: currentAlbumPath,
							parent: parent,
							childs:[],
							photos: []
						});

						newdbAlbum.save(function(err, album){
							if (err)
								handleError(err);
							if (dirs.length !== 0){
									createAlbum(files, mainAlbum, dirs, album, currentAlbumPath);
								}else{
									createAlbums(files, mainAlbum);
								}
						});
					}else{
						if (dirs.length !== 0){
							createAlbum(files, mainAlbum, dirs, album, currentAlbumPath);
						}else{
							createAlbums(files,  mainAlbum);
						}
					}
				});

			}else{
				createAlbums(files, mainAlbum);
			}
		}

		function createAlbums(files, mainAlbum){
			var file = files.shift();

			if(file)
				createAlbum(files, mainAlbum, file.rootDir.split('/'), mainAlbum, '');
			else
				createPhotos(photoFiles);
		}

		function makeExif(photo, callback){
			try {
				var staticPath = path.join(resources, photo.path);
				new ExifImage({
					image : staticPath//'resources/photos/Ireland/West Coast/_MG_4174.jpg'
				}, function (error, data) {
					if (error){
						handleError('[exif.js] error in ' + staticPath + ': ' + error);
						return callback(null, photo);
					}else{
						var exifMap = {};
						var image = data.image,
						exif = data.exif,
						gps = data.gps;

						if(image){
							exifMap.Make = image.Make;
							exifMap.Model = image.Model;
						}
						if(exif){
							exifMap.DateTimeOriginal = exif.DateTimeOriginal;
							exifMap.ApertureValue = exif.ApertureValue;
							exifMap.FocalLength = exif.FocalLength;
							exifMap.ISOSpeedRatings = exif.ISOSpeedRatings;
							exifMap.ExposureTime = exif.ExposureTime;
						}
						if(gps){
							exifMap.GPSLatitude = exif.GPSLatitude;
							exifMap.GPSLongitude = exif.GPSLongitude;
						}

						var exifdb = new Exif(exifMap);
						exifdb.save(function (err, exif) {
							if (err)
								handleError(err);
							Photo.findByIdAndUpdate(photo, { $set: {exif: exif._id}}, function(err){
								if (err)
									handleError(err);
							});
						});
						return callback(null, photo);
					}
				});
			} catch (error) {
				handleError(error);
				return callback(null, photo);
			}
		}

function createPhoto(files, file){

			var parentAlbumName = file.rootDir.split('/').pop();
			if (parentAlbumName === ''){
				parentAlbumName = mainAlbumName;
			}

			var filepath = path.join(shortPhotoDir, file.rootDir, file.name);
			var thumbPath = path.join(shortThumbDir, file.rootDir, file.name);
			var photoName = file.name.replace(/.[^\.]+$/, '');

			Album.where({name: parentAlbumName}).findOne(function(err, parent){
				var dbPhoto = new Photo({
					name: photoName,
					path: filepath,
					thumbPath: thumbPath,
					parent: parent
				});
				dbPhoto.save(function(err, photo){
					makeExif(photo, function(err, self){
					});
					createPhotos(files);
				});
			});
		}

		function createPhotos(files){
			var file = files.shift();
				if(file){
					createPhoto(files, file);
				}
			}

		 Album.where({ name: mainAlbumName}).findOne(function (err, album) {
			if (err) return handleError(err);
			if (album) {
				createAlbums(files, album);
			}else{
				var dbAlbums = new Album({
						name: mainAlbumName,
						prettyName: mainAlbumName,
						description: '',
						path: shortPhotoDir,
						url: '',
						childs:[],
						albums: [],
						photos: []
				});
				dbAlbums.save(function(err, album) {
					if (err)
						handleError(err);
					createAlbums(files, album);
				});
			}

		});
		res.json('');
	});
};

exports.getAlbums = function(req, res){
	var albumId = req.params.albumId;

	function sortByKey(array, key) {
		return array.sort(function(a, b) {
			var x = a[key]; var y = b[key];
			return ((x > y) ? -1 : ((x < y) ? 1 : 0));
		});
	}

	function createThumb(albums, albumsId, album, childAlbum){
		if(childAlbum.photos.length !== 0){
			var query;
			if(req.user.roles.indexOf('admin') < -1){
				query = {parent: childAlbum._id, users: req.user._id};
			}else{
				query = {parent: childAlbum._id};
			}
			Photo.find(query, null, {sort: {name: 'asc'}}, function(err, photos){
				var photo = photos[0];
				if(photo){
					album.thumb = photo.thumbPath;
				}
				albums.push(album);
				if(albumsId.length === 0)
					res.json(sortByKey(albums, 'name'));
				else
					iterate(albums, albumsId);
			});
		}else{
			if(album.childs.length !== 0){
				Album.findById(album.childs[0], function(err, childAlbum){
					createThumb(albums, albumsId, album, childAlbum);
				});
			}
		}
	}

	function iterate(albums, albumsId){
		var albumId = albumsId.shift();
		Album.findById(albumId, function(err, album){
			if (err)
				handleError(err);
			if(req.user && (req.user.roles.indexOf('admin') > -1||
							album.users.indexOf(req.user._id)> -1)){
				createThumb(albums, albumsId, album, album);
			}else{
				if(albumsId.length === 0)
					res.json(sortByKey(albums, 'name'));
				else
					iterate(albums, albumsId);
			}
		});
	}

	function findAlbumCb(err, album){
		if(album && req.user){
			if(album.childs.length !== 0)
				iterate([], album.childs);
		}
	}

	if(!albumId){
		Album.where({name:'Angular Photo Gallery'}).findOne(findAlbumCb);
	}else{
		Album.findById(albumId, findAlbumCb);
	}

};

exports.getPhotos = function(req, res, next){

	function iterate(photos, photosId){
		var photoId = photosId.shift();
		Photo.findById(photoId, function(err, photo){
			if(req.user && (req.user.roles.indexOf('admin') > -1||
							photo.users.indexOf(req.user._id)> -1)){
				var tbDirPath = path.dirname(resources + photo.thumbPath);
				var mkdirp = require('../../config/fileUtils');
				if (!fs.existsSync(tbDirPath)){
					try {
						mkdirp.sync(tbDirPath, '0755');
					} catch (err) {
						handleError(err);
					}
				}
				var srcPath = path.join(resources, photo.path);
				var dstPath = path.join(resources, photo.thumbPath);

				if(!fs.existsSync(dstPath)){
					crop_image(srcPath, dstPath);
				}
				photos.push(photo);
			}
			if(photosId.length === 0){
				res.json(photos);
			}else{
				iterate(photos, photosId);
			}
		});
	}

	Album.findById(req.params.albumId, function(err, album){
		if(album && req.user){
			if(album.photos.length !== 0){
				var photosId = album.photos;
				iterate([], photosId);
			}
		}
	});
};

exports.getPhoto = function(req, res){
	Photo.findById(req.params.photoId, function(err, photo){
		res.json(photo);
	});
};

exports.getNextPhoto = function(req, res){
	Photo.findById(req.params.photoId, function(err, photo){
		var query;
		if(req.user.roles.indexOf('admin') < -1){
			query = {parent: photo.parent, users: req.user._id};
		}else{
			query = {parent: photo.parent};
		}
		Photo.find(query,null,  {sort: {name: 'asc'}}, function(err, photos){
			var index = 0;
			for(var i = 0; i < photos.length; i++){
				if(String(photo._id) === String(photos[i]._id)){
					index = i;
				}
			}
			var nextIndex = index + 1;
			if(nextIndex === photos.length){
				nextIndex = 0;
			}
			res.json(photos[nextIndex]);
		});
	});
};

exports.getPrevPhoto = function(req, res){
		Photo.findById(req.params.photoId, function(err, photo){
		var query;
		if(req.user.roles.indexOf('admin') < -1){
			query = {parent: photo.parent, users: req.user._id};
		}else{
			query = {parent: photo.parent};
		}
		Photo.find(query, null, {sort: {name: 'asc'}}, function(err, photos){
			var index = 0;
			for(var i = 0; i < photos.length; i++){
				if(String(photo._id) === String(photos[i]._id)){
					index = i;
				}
			}
			var prevIndex = index - 1;
			if(prevIndex < 0){
				prevIndex = photos.length - 1;
			}
			res.json(photos[prevIndex]);
		});
	});
};

exports.addUserPhoto = function(req, res){
	User.findOne({username: req.body.user.name}, function(err, user){
		Photo.findByIdAndUpdate(req.body.photo._id, {$addToSet: {users: user}}, function(err, photo) {
			if (err)
				handleError(err);
			res.json(user);
		});
	});
};

exports.delUserPhoto = function(req, res){
	User.findOne({username: req.body.user.name}, function(err, user){
		Photo.findByIdAndUpdate(req.body.photo._id, {$pull: {users: user._id}}, function(err, photo) {
			if (err)
				handleError(err);
			res.json(user);
		});
	});
};

exports.addUserAlbum = function(req, res){
	User.findOne({username: req.body.user.name}, function(err, user){
		Album.findByIdAndUpdate(req.body.album._id, {$addToSet: {users: user}}, function(err, album) {
			if (err)
				handleError(err);
			res.json(user);
		});
	});
};

exports.delUserAlbum = function(req, res){
	User.findOne({username: req.body.user.name}, function(err, user){
		Album.findByIdAndUpdate(req.body.album._id, {$pull: {users: user._id}}, function(err, album) {
			if (err)
				handleError(err);
			res.json(user);
		});
	});
};

exports.downloadPhoto = function(req, res){

	Photo.findById(req.params.photoId, function(err, photo) {
			if (err)
				handleError(err);
			var file = '/home/mathieu/Devel/node/meanjs2/resources/' + photo.path;
			console.log(file);
			res.download(file);
		});
};
