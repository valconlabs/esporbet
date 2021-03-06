var gulp = require('gulp'); // Require gulp

// Sass dependencies
var sass = require('gulp-sass'); // Compile Sass into CSS
var minifyCSS = require('gulp-minify-css'); // Minify the CSS

// Minification dependencies
var minifyHTML = require('gulp-minify-html'); // Minify HTML
var concat = require('gulp-concat'); // Join all JS files together to save space
var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs
var uglify = require('gulp-uglify'); // Minify JavaScript
var imagemin = require('gulp-imagemin'); // Minify images

// Other dependencies
var size = require('gulp-size'); // Get the size of the project
var browserSync = require('browser-sync').create(); // Reload the browser on file changes
var jshint = require('gulp-jshint'); // Debug JS files
var stylish = require('jshint-stylish'); // More stylish debugging
var gulpImport = require('gulp-html-import');

// Tasks -------------------------------------------------------------------- >

// Task to compile Sass file into CSS, and minify CSS into build directory
gulp.task('styles', function() {
  gulp.src('./src/assets/styles/common.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/assets/styles/css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/assets/styles/'))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

// Task to minify new or changed HTML pages
gulp.task('html', function() {
  gulp.src('./src/templates/**/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({
        stream: true,
      }));
});

// Task to concat, strip debugging and minify JS files
gulp.task('scripts', function() {
  gulp.src(['./src/assets/scripts/lib.js', './app/scripts/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/scripts/'));
});

// Task to minify images into build
gulp.task('images', function() {
  gulp.src('./src/assets/img/**')
  .pipe(imagemin())
  .pipe(gulp.dest('./dist/assets/img/'));
});

// Task to run JS hint
gulp.task('jshint', function() {
  gulp.src('./src/assets/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Task to get the size of the app project
gulp.task('size', function() {
  gulp.src('./src/**')
	.pipe(size({
    showFiles: true,
  }));
});

// Task to get the size of the build project
gulp.task('build-size', function() {
  gulp.src('./dist/**')
  .pipe(size({
    showFiles: true,
  }));
});

gulp.task('import', function () {
  gulp.src('./src/templates/index.html')
      .pipe(gulpImport('./src/templates/'))
      .pipe(gulp.dest('dist')); 
});

gulp.task('libs', function () {
  gulp.src('./src/libs/**')
    .pipe(gulp.dest('./dist/libs/'))
    .pipe(browserSync.reload({
      stream: true,
    }));
});

// Serve application
gulp.task('serve', ['styles', 'html', 'scripts', 'images', 'jshint', 'size', 'import', 'libs'], function() {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
  });
});

// Run all Gulp tasks and serve application
gulp.task('default', ['serve', 'styles', 'import'], function() {
  gulp.watch('src/assets/styles/**/*.scss', ['styles'], browserSync.reload)
  gulp.watch('src/templates/*.html', ['html', 'import'], browserSync.reload);
  gulp.watch('src/assets/scripts/**/*.js', browserSync.reload);
  gulp.watch('src/assets/img/**', browserSync.reload);
});