require('babel-core/register');

const babelify = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const watch = require('gulp-watch');
const watchify = require('watchify');

gulp.task('mocha', () => {
    return gulp.src(['test/*.js'], {
            read: false
        })
        .pipe(mocha({
            reporter: 'list'
        }))
        .on('error', gutil.log);
});

var path = {
    OUT: 'build.js',
    DEST2: '/home/apache/www-modules/admimail/se/se',
    DEST_BUILD: 'build',
    DEST_DEV: 'dev',
    ENTRY_POINT: './src/js/main.jsx'
};

gulp.task('watch', [], function() {
    var bundler = browserify({
        entries: 'app/scripts/source.js',
        extensions: ['.js', '.jsx'],
        debug: true,
        fullPaths: true,
        cache: {},
        packageCache: {}
    });
    bundler.plugin(watchify);

    var rebundle = function() {
        return bundler.transform('babelify', {
            presets: ['es2015', 'react']
        })
        .bundle()
        .pipe(source('source.min.js'))
        .pipe(gulp.dest('./public/js'));
    };

    bundler.on('update', rebundle);
    return rebundle();
});



gulp.task('scripts', () => {
    var b = browserify({
        entries: 'app/scripts/source.js',
        debug: true,
        cache: {},
        packageCache: {},
        plugin: [watchify]
    });

    return b.transform('babelify', {
            presets: ['es2015', 'react']
        })
        .bundle()
        .pipe(source('source.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('sass', () => {
    return gulp.src('./app/stylesheets/**/*.sass')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('sass-watch', ['sass'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('js-watch', ['watch'],function(done) {
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
    gulp.watch(['app/views/*.pug'], browserSync.reload());
    gulp.watch(['app/stylesheets/styles.sass'], ['sass-watch']);
    gulp.watch(['app/scripts/*.js'], ['js-watch']);
});
