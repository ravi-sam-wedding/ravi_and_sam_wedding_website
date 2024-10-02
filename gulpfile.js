'use strict'; // Enforce strict mode for better error handling and avoiding unsafe JavaScript practices

// Import required modules
var gulp = require('gulp'); // Gulp for task automation
var sass = require('gulp-sass')(require('sass')); // Gulp-Sass for compiling SCSS files
var terser = require('gulp-terser'); // Gulp-Terser for minifying JavaScript files
var cleanCSS = require('gulp-clean-css'); // Gulp-Clean-CSS for minifying CSS files
var rename = require('gulp-rename'); // Gulp-Rename for renaming files

// Task to compile all SCSS files to compressed CSS, excluding already minified files
gulp.task('sass', function () {
    return gulp.src(['./sass/**/*.scss', '!./sass/**/*.min.scss']) // Source all SCSS files, excluding already minified ones
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Compile SCSS to CSS with compressed output style
        .pipe(rename({suffix: '.min'})) // Rename the output files to add '.min' suffix
        .pipe(gulp.dest('./css')); // Output the compiled CSS to the 'css' directory
});

// Task to minify all CSS files in the 'css' folder, excluding already minified files
gulp.task('minify-css', function () {
    return gulp.src(['./css/**/*.css', '!./css/**/*.min.css']) // Source all CSS files, excluding already minified ones
        .pipe(cleanCSS()) // Minify the CSS files
        .pipe(rename({suffix: '.min'})) // Rename the output files to add '.min' suffix
        .pipe(gulp.dest('./css')); // Output the minified CSS to the 'css' directory
});

// Task to watch changes in SCSS files and run the 'sass' task automatically
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', gulp.series('sass')); // Watch all SCSS files in 'sass' directory and subdirectories
});

// Task to minify all JavaScript files in the 'js' folder, excluding already minified files
gulp.task('minify-js', function () {
    return gulp.src(['./js/**/*.js', '!./js/**/*.min.js']) // Source all JavaScript files, excluding already minified ones
        .pipe(terser()) // Minify the JavaScript files
        .pipe(rename({suffix: '.min'})) // Rename the output files to add '.min' suffix
        .pipe(gulp.dest('./js')); // Output the minified JavaScript to the 'js' directory
});

// Default task that runs 'sass', 'minify-css', and 'minify-js' tasks
gulp.task('default', gulp.series('sass', 'minify-css', 'minify-js')); // Run 'sass', 'minify-css', and 'minify-js' in sequence when 'gulp' is executed without arguments
