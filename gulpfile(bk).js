/**
 * Created by yangmz on 2016/11/14.
 */

var gulp = require('gulp'),//gulp
    less = require('gulp-less'),//less
    autoprefixer = require('gulp-autoprefixer'),//添加css前缀
    minifycss = require('gulp-minify-css'),//压缩css
    jshint = require('gulp-jshint'),//js代码校验
    uglify = require('gulp-uglify'),//压缩js代码
    imagemin = require('gulp-imagemin'),//压缩图片
    pngquant = require('imagemin-pngquant'), //
    rename = require('gulp-rename'),//重命名
    concat = require('gulp-concat'),//合并js文件
    notify = require('gulp-notify'),//更新提醒
    cache = require('gulp-cache'),//图片缓存，只有图片替换了才会压缩
    livereload = require('gulp-livereload'),//自动刷新页面
    del = require('del');//清除文件

//libs压缩、合并
gulp.task('libs', function () {
    gulp.src([
            '../src/libs/jquery.min.js',
            '../src/libs/jquery.cookie.js',
            '../src/libs/jquery.easing.min.js'
        ])
        .pipe(concat('libs.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../public/libs'));
});

//util压缩、合并
gulp.task('util', function () {
    gulp.src('../src/util/*')
        .pipe(concat('util.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../public/util'));
});

//js压缩
gulp.task('view', function () {
    gulp.src('../src/view/*')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../public/view'))
        .pipe(livereload());
});

//css压缩、合并
gulp.task('less', function () {
    gulp.src('../src/less/*')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(minifycss())
        .pipe(concat('style.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../public/css/'))
        .pipe(livereload());
});

//img压缩
gulp.task('images', function () {
    var imgType = {
        optimizationLevel: 5,
        progressive: true,
        interlaced: true,
        multipass: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    };
    gulp.src('../src/images/*')
        .pipe(imagemin(imgType))
        .pipe(gulp.dest('../public/images'))
        .pipe(livereload());
});

//压缩前删除原来文件夹里的内容
gulp.task('clean', function (cb) {
    //del(['../public/css', '../public/libs'], cb);
    del.sync(['../public/css/', '../public/libs/', '../public/util/', '../public/view/'], {force: true});
});

//清理图片
gulp.task('cleanImg', function (cb) {
    del.sync(['../public/images/'], {force: true});
});

//清理图片缓存
gulp.task('cleanCash', function (done) {
    return cache.clearAll(done);
});

//默认任务
gulp.task('default', function () {
    gulp.run('clean', 'cleanCash', 'less', 'images', 'libs', 'util', 'view');
    gulp.watch('../src/less/*', ['less']);
    gulp.watch('../src/images/*', ['images']);
    gulp.watch('../src/libs/*', ['libs']);
    gulp.watch('../src/util/*', ['util']);
    gulp.watch('../src/view/*', ['view']);
});