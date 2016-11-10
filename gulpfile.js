require('babel-core/register');
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

gulp.task('mocha', () => {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('scripts', () => {
    gulp.src(['app/react/*.js'])
        .pipe(browserify())
        .pipe(uglify())
        .pipe(concat('dest.js'))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('sass', () => {
    return gulp.src('./app/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('browser-sync', () => {
    browserSync({
        port: 8082
    });
});

gulp.task('lint-js', () => {
  return gulp.src([
    'app/react/*.js',
    'app/common/*.js',
    'app/controllers/*.js',
    'app/models/*.js',
    'app/routes/*.js',
    'app/config/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('default', ['browser-sync'], () => {
    gulp.watch(['public/index.html'], browserSync.reload);
    gulp.watch(['app/sass/styles.scss'], ['sass', browserSync.reload]);
    gulp.watch(['app/react/*.js'], ['scripts', browserSync.reload]);
});