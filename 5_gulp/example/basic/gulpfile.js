var gulp = require('gulp'),
    path = require('path'),
    webpack = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    gulpZip = require('gulp-zip'),
    del = require('del'),
    open = require('open'),
    fs = require('fs'),
    webpackDevServer = require('webpack-dev-server'),
    defaultSettings = require('./config/defaults.js'),
    webpackDevConfig = require('./config/webpack.config.js'),
    webpackDistConfig = require('./config/webpack.dist.config.js'),
    packageConfig = require('./config/package.js'),
    filePath = defaultSettings.filePath;

gulp.task('dev', function() {
    var compiler = webpack(webpackDevConfig);
    new webpackDevServer(compiler, {
        contentBase: './',
        historyApiFallback: true,
        hot: true,
        noInfo: false,
        publicPath: filePath.publicPath
    }).listen(defaultSettings.port, function(err) {
        console.log('listening: http://localhost:' + defaultSettings.port);
        console.log('Opening your system browser...');
        open('http://localhost:' + defaultSettings.port + '/webpack-dev-server/');
    })
});

gulp.task('clean', function(cb) {
    return del(['build/**/*'], cb);
});

gulp.task('build', ['clean'], function() {
    return gulp.src(filePath.srcPath)
        .pipe(gulpWebpack(webpackDistConfig))
        .pipe(gulp.dest('build/'));
});

gulp.task('zip', function() {
    return gulp.src('./package/**/*')
        .pipe(gulpZip('test.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('package', function() {
    return gulp.src(filePath.srcPath)
        .pipe(gulpWebpack(packageConfig))
        .pipe(gulp.dest('package/'));
});

gulp.task('default', ['dev']);