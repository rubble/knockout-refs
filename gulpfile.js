const babel = require("gulp-babel"),
  gulp = require("gulp"),
  karma = require("karma"),
  bump = require("gulp-bump"),
  license = require("gulp-license"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify");

gulp.task('dev', () => {
  return gulp.src('src/ref.js')
    .pipe(babel({
      presets: ["es2015"]
    }))
    .pipe(license("MIT", {
      organization: "Rubble LTD. All rights reserved."
    }))
    .pipe(gulp.dest('dist'))
    .pipe(rename("ref.min.js"))
    .pipe(uglify())
    .pipe(license("MIT", {
      organization: "Rubble LTD. All rights reserved.",
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch('./src/*.js', ['dev']);
});

gulp.task('bump', () => {
  return gulp.src('./package.json')
    .pipe(bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('build', ['dev', 'bump']);
