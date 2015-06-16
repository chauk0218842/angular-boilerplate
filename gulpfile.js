'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  jshint = require('gulp-jshint'),
  karma = require('karma').server,
  ngAnnotate = require('gulp-ng-annotate'),
  sass = require('gulp-sass'),
  sasslint = require('gulp-scss-lint'),
  uglify = require('gulp-uglify'),
  appSrcPath = './src/app/',
  distPath = './dist/',
  nodeSrcPath = './node_modules/',
  sassSrcPath = './src/sass/',
  srcPath = './src/',
  testSrcPath = './src/app/';

gulp.task('connect.init', function () {
  connect.server({
    root: distPath,
    livereload: true
  });
});

gulp.task('connect.reload', function () {
  gulp.src(distPath + '*.html')
    .pipe(connect.reload());
});

gulp.task('connect.watch', function () {
  gulp.watch(
    [appSrcPath + '**/*.js',
      testSrcPath + '**/*-spec.js',
      srcPath + '*.html'],
    ['script.lint',
      'script.test',
      'build.compile',
      'connect.reload']);

  gulp.watch(
    [sassSrcPath + '**/*.scss'],
    ['sass.lint',
      'sass.css',
      'connect.reload']);

  gulp.watch(
    [srcPath + '**/*.html'],
    ['connect.reload']);
});

gulp.task('script.lint', function () {
  gulp.src([appSrcPath + '**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('script.test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('script', ['script.lint', 'script.test']);

gulp.task('sass.lint', function () {
  gulp.src (sassSrcPath + '**/*.scss')
    .pipe(sasslint());
});

gulp.task('sass.css', function () {
  gulp.src([sassSrcPath + '**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(distPath + 'styles/'));
});

gulp.task('sass', ['sass.lint', 'sass.css']);

gulp.task('build.compile', function () {

  gulp.src([appSrcPath + '**/*.js',
    '!' + appSrcPath + '**/*-spec.js'])
    .pipe(ngAnnotate())
    .pipe(gulp.dest(distPath + 'app/'));

  gulp.src([srcPath + '**/*.html'])
    .pipe(gulp.dest(distPath));

  gulp.src([nodeSrcPath + 'angular/angular.min.js'])
    .pipe(gulp.dest(distPath + 'vendor/angular/'));
});

gulp.task('build.uglify', function () {

  gulp.src([distPath + '**/*.js',
    '!' + distPath + 'vendor/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest(distPath));

});

gulp.task('build', ['build.compile', 'build.uglify']);

gulp.task('tdd', function () {
  gulp.watch(
    [appSrcPath + '**/*.js',
      testSrcPath + '**/*-spec.js'],
    ['script.lint',
      'script.test']);
});

gulp.task('serve',
  ['connect.init',
    'script',
    'sass',
    'build.compile',
    'connect.reload',
    'connect.watch']);

gulp.task('test', ['script']);

gulp.task('default',
  ['script',
    'sass',
    'build']);
