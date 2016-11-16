require('babel-core/register');

const babelify = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const reactify = require('reactify');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const watch = require('gulp-watch');

gulp.task('mocha', () => {
    return gulp.src(['test/*.js'], {
            read: false
        })
        .pipe(mocha({
            reporter: 'list'
        }))
        .on('error', gutil.log);
});

gulp.task('scripts', () => {
    var b = browserify({
    entries: 'app/scripts/source.js',
    debug: true
  });
  b.transform('babelify', {presets: ['es2015', 'react']})
  .bundle()
  .pipe(source('source.min.js'))
  .pipe(buffer())
//  .pipe(uglify())
  .pipe(gulp.dest('./public/js'));
});

gulp.task('sass', () => {
    return gulp.src('./app/stylesheets/**/*.sass')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('sass-reload', ['sass'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('js-reload', ['js-watch'], function(done) {
    browserSync.reload();
    done();
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
gulp.task('browser-sync', () => {
    browserSync.init({
        port: 8082
    });
});

gulp.task('default', ['browser-sync'], () => {
    gulp.watch(['app/views/*.pug', 'app/controllers/*.js'], () => {
        setTimeout(browserSync.reload, 700);
    });
    gulp.watch(['app/scripts/*.js'], ['scripts']);
    gulp.watch(['app/stylesheets/styles.sass'], ['sass-reload']);
});
