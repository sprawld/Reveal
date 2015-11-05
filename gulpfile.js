"use strict";

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
/*	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCss = require('gulp-minify-css'),
//	imagemin = require('gulp-imagemin'),
	imageResize = require('gulp-image-resize'),
	uglify = require('gulp-uglify'),
*/
	merge = require('merge-stream');

gulp.task('img',function() {
	return merge.apply(
		[100,200,300,400,500].map(function(a) {
			return gulp.src('./src/img/*.jpg')
				.pipe($.imageResize({ 
					width : a,
					height : a,
					crop : true,
				}))
				.pipe(gulp.dest('./dist/img/'+a+'/'));
		})
		);
});

gulp.task('copyimg',function() {
	return gulp.src('./src/img/*.jpg')
		.pipe($.imageResize({ 
			width : 2000,
			height : 2000,
			crop : false,
			upscale: false,
		}))
		.pipe(gulp.dest('./dist/img/'));
});


gulp.task('sass',function() {
	return gulp.src('./src/sass/*.scss')
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.autoprefixer('last 10 versions'))
		.pipe($.minifyCss())
		.pipe(gulp.dest('./dist/css/'));
});


gulp.task('files',function() {
	gulp.src(['./src/**/*.*','!./src/sass/**/*.*','!./src/js/**/*.*','!./src/img/**/*.*'])
		.pipe(gulp.dest('./dist/'));
});

gulp.task('watch',function() {
	gulp.watch('./src/sass/*.scss',['sass']);
	gulp.watch('./src/js/*.js',['js']);
	gulp.watch('./src/img/*.jpg',['img']);
	gulp.watch(['./src/**/*.*','!./src/sass/**/*.*','!./src/js/**/*.*','!./src/img/**/*.*'],['files'])
});

gulp.task('js',function() {
	return gulp.src('./src/js/*.js')
		.pipe($.include())
		.pipe($.uglify())
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('dist',['sass','js','img','files']);
gulp.task('default',['dist','watch']);
