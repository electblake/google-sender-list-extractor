var gulp = require('gulp');

// gulp support
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');

// util
var debug = require('gulp-debug');
var gutil = require('gulp-util');
var path = require('path');

var src = {
	scripts: './public/scripts',
	styles: './public/styles'
};

var dist = {
	scripts: './public/js',
	styles: './public/css'
};

gulp.task('sass', function() {

	var includePaths = [path.resolve(__dirname, 'public', 'bower_components')];
	gutil.log('sass includePaths: ', includePaths);
	return gulp.src('./public/sass/**/*.scss')
		.pipe(sass({
			includePaths: includePaths
		}))
		.pipe(gulp.dest(dist.styles))
		.pipe(debug({ title: 'sass' }));
});

gulp.task('scripts', function() {
	return gulp.src('./public/scripts/**/*.js')
		.pipe(concat('app.bundle.js'))
		.pipe(gulp.dest(dist.scripts))
		.pipe(debug({ title: 'scripts' }));
});

gulp.task('nodemon', function() {
	return nodemon({ script: 'server.js' });
});

gulp.task('watch', function() {
	gulp.watch('./public/scripts/**/*.js', ['scripts']);
	gulp.watch('./public/sass/**/*.scss', ['sass']);
	gulp.start('nodemon');
});

gulp.task('default', ['scripts', 'sass'], function() {
	gulp.start('watch');
});