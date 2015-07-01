var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('serve', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: {
        enable: true,
        port: 4321
      },
      port: 4000,
      fallback: 'index.html',
      open: true
    }));
});
