'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import browsersync from 'browser-sync';
import watch from 'gulp-watch';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import nunjucksRender from 'gulp-nunjucks-render';
import del from 'del';
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';

browsersync.create();

const paths = {
    src: './src',
    dist: './dist',
    static: './src/static'
};

const browserifyOpts = {
    debug: true,
    paths: [ paths.static + '/js' ],
    cache: {},
    packageCache: {},
    plugin: [ watchify ]
};

gulp.task('browsersync', () => {
    browsersync.init({
        server: {
            baseDir: paths.dist
        },
        ghostMode: false,
        /*notify: false,*/
        open: false,
        port: 8000
    });
});

gulp.task('templates', () => {
    return gulp.src(paths.src + '/**/*.html')
        .pipe(nunjucksRender({path: [paths.src + '/layouts', paths.src + '/components']}))
        .pipe(gulp.dest(paths.dist))
        .pipe(browsersync.stream());
});

gulp.task('js', function() {

    const browserified = browserify(paths.static + '/js/main.js', browserifyOpts).transform(babelify);

    const bundle = function() {

        return browserified.bundle()
            .on('error', err => console.log(err.toString()))
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.dist + '/static/js/'))
            .pipe(browsersync.reload({stream: true}));

    };

    browserified.on('update', bundle);

    return bundle();

});

gulp.task('css', function() {

    return gulp.src(paths.static + '/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist + '/static/css'))
        .pipe(browsersync.reload({ stream: true }));

});

gulp.task('clean', function() {
    del.sync(paths.dist);
});

gulp.task('img', function() {
    return gulp.src(paths.static + '/img/**/*')
        .pipe(gulp.dest(paths.dist + '/static/img'))
        .pipe(browsersync.reload({stream: true}));
});

gulp.task('watch', () => {
    watch([paths.src + '/**/*.html'], () => gulp.start('templates'));
    watch([paths.src + '/media/**/*'], () => gulp.start('media'));
    watch([paths.static + '/scss/**/*.scss'], () => gulp.start('css'));
    //watch(paths.static + '/js/**/*.js', () => gulp.start('js'));
});

gulp.task('dev', ['clean', 'templates', 'js', 'css', 'img', 'browsersync', 'watch']);