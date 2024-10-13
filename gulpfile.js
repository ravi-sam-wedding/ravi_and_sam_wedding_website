'use strict'; // Enforce strict mode for better error handling and avoiding unsafe JavaScript practices

// Import required modules
var gulp = require('gulp'); // Gulp for task automation
var sass = require('gulp-sass')(require('sass')); // Gulp-Sass for compiling SCSS files
var terser = require('gulp-terser'); // Gulp-Terser for minifying JavaScript files
var cleanCSS = require('gulp-clean-css'); // Gulp-Clean-CSS for minifying CSS files
var rename = require('gulp-rename'); // Gulp-Rename for renaming files
var replace = require('gulp-replace'); // Gulp-Replace for replacing text in files
var fs = require('fs'); // Node.js File System module for reading files
var crypto = require('crypto'); // Node.js Crypto module for generating MD5 hashes

// Task to generate guestList JSON and embed it into scripts.js
gulp.task('generate-guestlist', function () {
    // Read guestList
    const guestListJson = fs.readFileSync('guestList.json', 'utf8');

    // Process for rsvpValidation.test.js (or any other test file)
    gulp.src('tests/rsvpValidation.test.js', { allowEmpty: true })
    // Remove any previous guest list definition by wiping out the placeholder line in the test file
    .pipe(replace(/const guestList = .*;/, '/* GUESTLIST_PLACEHOLDER */'))
    // Replace the placeholder with the new guest list for tests
    .pipe(replace('/* GUESTLIST_PLACEHOLDER */', `const guestList = ${guestListJson};`))
    .pipe(gulp.dest('tests')); // Write the output back to the 'tests' folder

    return gulp.src('js/scripts.js', { allowEmpty: true })
        // Remove any previous guest list definition by wiping out the placeholder line
        .pipe(replace(/const guestList = .*;/, '/* GUESTLIST_PLACEHOLDER */'))
        // Replace placeholder with the new guest list
        .pipe(replace('/* GUESTLIST_PLACEHOLDER */', `const guestList = ${guestListJson};`))
        .pipe(gulp.dest('js')); // Write the output back to the 'js' folder
});

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

// Default task that runs 'sass', 'minify-css', 'minify-js', and 'generate-guestlist' tasks
gulp.task('default', gulp.series('generate-guestlist', 'sass', 'minify-css', 'minify-js')); // Run all tasks in sequence when 'gulp' is executed without arguments
