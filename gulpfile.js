const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  watch = require("gulp-watch");

gulp.task('sass-compile', function() {
  return gulp.src('src/styles/**/*.*')
    .pipe(sass())
    .pipe(gulp.dest('src/css/'))
});

gulp.task('watch-sass', function() {
    gulp.watch('src/styles/**/*.*', [ 'sass-compile' ]);
});

gulp.task('default', [ 'sass-compile' ]);

gulp.task('watch', [ 'watch-sass' ]);