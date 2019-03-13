const gulp = require("gulp"),
      sass = require("gulp-sass"),
      browserSync = require("browser-sync"),
      reload = browserSync.reload,
      plumber = require("gulp-plumber");

const postcss = require("gulp-postcss"),
      sourceMaps = require("gulp-sourcemaps"),
      cssImport = require("postcss-import"),
      precss = require("precss"),
      autoprefixer = require("autoprefixer"),
      minify = require("cssnano");




var src = {
    scss: "src/styles/**/*.scss",
    css:  "src/styles",
    html: "src/*.html"
};



gulp.task("serve", function() {

    browserSync.init({
        port: 3001,
        proxy: {
            target: "http://localhost:3000",
        }     
    })

    gulp.watch(src.scss, ["sass"]);
    gulp.watch(src.scss).on("change", reload);
});




gulp.task("sass", function() {
 
  var processors = [
    postcss,
    cssImport,
    precss,
    autoprefixer,
    minify
  ];

  return gulp
    .src("src/styles/main.scss")
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(src.css));
});

gulp.task("watch-sass", function() {
    gulp.watch(src.scss).on("change", ["sass"]);
})

gulp.task("reload", function() {
    reload();
});




gulp.task("build-sass", ["sass"]);

gulp.task("watch-sass", ["watch-sass"]);

gulp.task("default", ["serve"]);
