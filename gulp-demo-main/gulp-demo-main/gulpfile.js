const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")

const imagemin = require('gulp-imagemin');
function imgMinify() {
    return gulp.src('project/pics/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}

exports.img = imgMinify

const htmlmin = require('gulp-htmlmin'); //dist copy
function minifyHTML() {
    return src('project/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}

exports.html = minifyHTML

const concat = require('gulp-concat');
const terser = require('gulp-terser');// minify

function jsMinify() {
    return src('project/js/**/*.js',{sourcemaps:true}) // all js files 
    
        .pipe(concat('all.min.js'))
        .pipe(terser()) 
        .pipe(dest('dist/assets/js',{sourcemaps:'.'})) //source map
}
exports.js = jsMinify

var cleanCss = require('gulp-clean-css');
function cssMinify() {
    return src("project/css/**/*.css")
        .pipe(concat('style.min.css'))
        .pipe(cleanCss()) // minify
        .pipe(dest('dist/assets/css'))
}
exports.css = cssMinify
//sass task
const sass = require('gulp-sass')(require('sass'));
function sassMinify() {
    return src(["project/sass/**/*.scss", "project/css/**/*.css"],{sourcemaps:true})
        .pipe(sass())
        .pipe(concat('style.sass.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css',{sourcemaps:'.'}))
}



var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

//watch task
function watchTask() {
    watch('project/*.html',series(minifyHTML, reloadTask))
    watch('project/js/**/*.js',series(jsMinify, reloadTask))
    watch(["project/css/**/*.css","project/sass/**/*.scss"], series(sassMinify,reloadTask));
}
exports.default = series( parallel(imgMinify, jsMinify, sassMinify, minifyHTML), serve,watchTask)




