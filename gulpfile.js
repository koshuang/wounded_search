var gulp = require('gulp');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();

gulp.task('watch', ['inject'], function() {

  gulp.watch(['/*.html', 'bower.json'], ['inject']);

  gulp.watch([
    './src/styles/**/*.css'
  ], function(event) {
    gulp.start('inject');
  });

  gulp.watch('./src/**/*.js', function(event) {
    gulp.start('inject');
  });

  gulp.watch('./**/*.html', function(event) {
    browserSync.reload(event.path);
  });
});

gulp.task('inject', function() {
  var target = gulp.src('./index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {
    read: false
  });

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('serve', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});
