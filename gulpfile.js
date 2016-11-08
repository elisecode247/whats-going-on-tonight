var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var watch = require('gulp-watch');

gulp.task('mocha', function() {
    return gulp.src(['tests/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});
gulp.task('sass', function() {
    return gulp.src('./app/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./public/css'))
});

gulp.task('browser-sync', function() {
    browserSync({
        port: 8082
    });
});

gulp.task('default', ['browser-sync'], function() {

    gulp.watch(['public/index.html'], browserSync.reload);
    gulp.watch(['app/sass/styles.scss'], ['sass', browserSync.reload]);

});