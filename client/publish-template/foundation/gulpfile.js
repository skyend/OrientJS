var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var minify = require('gulp-minify');
var buffer = require('vinyl-buffer');

gulp.task('build', function() {
  return browserify({
      entries: './src/main.js',
      extensions: ['.js'],
      debug: true
    })
    .transform(babelify, {
      presets: ["es2015", "react"]
    })
    .bundle()
    .pipe(source('built-foundation.js'))
    // .pipe(buffer())
    // .pipe(minify({
    //   exclude: ['tasks'],
    //   ignoreFiles: ['.combo.js', '-min.js']
    // }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('js/**/*.js', ['build']);
  gulp.watch('Gelateria/**/*.js', ['build']);
});

gulp.task('default', ['watch']);