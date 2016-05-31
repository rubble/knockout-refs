const babel = require("gulp-babel"),
  gulp = require("gulp"),
  karma = require("karma"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify");

gulp.task('build', () => {
  return gulp.src('src/ref.js')
    .pipe(babel({
      presets: ["es2015"]
    }))
    .pipe(gulp.dest('dist'))
    .pipe(rename("ref.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
