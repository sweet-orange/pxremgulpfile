// 引入组件
var gulp = require('gulp');
var minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

var gulp = require('gulp');
var px2rem = require('gulp-pxrem');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
gulp.task('px2rem', function() {
    return gulp.src('./src/css/*')
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(px2rem({ remUnit: 64 }))
        .pipe(concat("index.min.css"))
        .pipe(minifycss())
        .pipe(gulp.dest('./build/css/'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify({
            message: 'Styles  task complete'
        }));
});
//js压缩
gulp.task('view', function() {
    gulp.src('./src/js/*.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify({
            message: 'js  task complete'
        }));
});
// Images
gulp.task('images', function() {
    return gulp.src('./src/images/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./build/images'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify({ message: 'Images task complete' }));
});

/* 监听 文件变化  */
gulp.task('dev', ['px2rem', 'view', 'images'], function() {
    browserSync.init({
        server: './'
    });
    gulp.watch('./src/css/*', ['px2rem']);
    gulp.watch('./src/js/*', ['view']);
    gulp.watch('./src/images/*', ['images']);
    gulp.watch('./*.html').on('change', reload);
});
gulp.task('default', ['dev']);