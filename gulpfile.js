var gulp = require('gulp'),
  connect = require('gulp-connect'),
  jshint = require('gulp-jshint'),
  ngAnnotate = require('gulp-ng-annotate'),
  karma = require('karma').server,
  srcPath = './src/',
  appSrcPath = './src/app/',
  testSrcPath = './test/',
  distPath = './dist/';

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
      'compile',
      'connect.reload']);
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

gulp.task('compile', function () {
  gulp.src([appSrcPath + '**/*.js'])
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./dist/app'));

  gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('tdd', function () {
  gulp.watch(
    [appSrcPath + '**/*.js',
      testSrcPath + '**/*-spec.js'],
    ['script.lint',
      'script.test']);
});

gulp.task('default',
  ['script.lint',
  'script.test',
  'compile']);

gulp.task('serve',
  ['connect.init',
    'default',
    'connect.reload',
    'connect.watch']);

gulp.task('test', ['script.test']);