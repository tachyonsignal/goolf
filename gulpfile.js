const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const beautify = require('gulp-beautify');
const size = require('gulp-size');
const terser = require('gulp-terser');

const SOURCE_FILE = 'goolf.js';
const OUTPUT_DIRECTORY = 'dist';
const BABEL_CONFIG = {
  presets: [],
  comments: false,
};
const BEAUTIFY_CONFIG = {
  indent_size: 2,
};

const configurations = {
  'full': {
    _ATTR: true,
    _ARRAY: true,
    _VOID_ELEMENTS: ['br','col','hr','img','input','link','meta'],
    _VOID: true,
    _WHITESPACE: true,
    _DELIMITER: 'Þ'
  },
  'basic': {
    _ARRAY: false,
    _ATTR: false,
    _VOID: false,
    _WHITESPACE: false,
    _DELIMITER: 'Þ'
  }
};


Object.keys(configurations).forEach(key  => {
  gulp.task( key , () => {
    return gulp
      .src(SOURCE_FILE)
      .pipe(babel(BABEL_CONFIG))
      .pipe(terser({
        ecma: 5,
        compress: {
          drop_console: true,
          drop_debugger: true,
          inline: 1, // inline function body.
          passes: 4, // number of times to re-compress.
          unsafe: true,
          global_defs: configurations[key]
        },
        mangle: {
          properties: {
            regex: /^(_terser_)/
          }
        },
      }))
      .pipe(rename({ suffix: `.${key}.min` }))
      .pipe(size({showFiles: true}))
      .pipe(size({showFiles: true, gzip: true}))
      .pipe(gulp.dest(OUTPUT_DIRECTORY))
      .pipe(beautify(BEAUTIFY_CONFIG))
      .pipe(rename({ prefix: "pretty." }))
      .pipe(gulp.dest(OUTPUT_DIRECTORY));
  });
});

gulp.task('default',  gulp.parallel(Object.keys(configurations)));