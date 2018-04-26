const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  watch = require("gulp-watch");

gulp.task('sass-compile', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/styles/'))
});

gulp.task('watch-sass', function() {
    gulp.watch('src/styles/main.scss', [ 'sass-compile' ]);
});

gulp.task('default', [ 'sass-compile' ]);

gulp.task('watch', [ 'watch-sass' ]);