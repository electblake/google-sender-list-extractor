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

var src = {
	script: './public/script',
	styles: './public/styles'
};

var dist = {
	script: './public/js',
	styles: './public/css'
};

gulp.task('sass', function() {
	return gulp.src('./public/sass/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest(dist.styles))
		.pipe(debug({ title: 'sass' }));
});

gulp.task('script', function() {
	return gulp.src('./public/script/**/*.js')
		.pipe(concat('app.bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dist.script))
		.pipe(debug({ title: 'script' }));
});

gulp.task('nodemon', function() {
	return nodemon({ script: 'server.js' });
});

gulp.task('watch', function() {
	gulp.watch('./public/script/**/*.js', ['script']);
	gulp.watch('./public/sass/**/*.scss', ['sass']);
	gulp.start('nodemon');
});

gulp.task('default', ['script', 'sass'], function() {
	gulp.start('watch');
});