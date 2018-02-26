var async = require('async');
var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var runTimestamp = Math.round(Date.now()/1000);

 
gulp.task('Iconfont', function(done){
  var iconStream = gulp.src(['svg/*.svg'])
    .pipe(iconfont({
		fontName: 'handy',
		normalize: true,
		fontHeight: 1001,
		prependUnicode: true, // recommended option
		formats: ['ttf', 'eot', 'woff',  'woff2', 'svg'], // default, 'woff2' and 'svg' are available
		
	}));
 
  async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function(glyphs, options) {
		console.log(glyphs);
        gulp.src(['templates/*.*'])
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'handy',
            fontPath: 'fonts/',
			className: 'icon',
			timestamp: runTimestamp, // recommended to get consistent builds when watching files
          }))
		  .pipe(gulp.dest('.'))
          .on('finish', cb);
      });
    },
    function handleFonts (cb) {
      iconStream
        .pipe(gulp.dest('fonts/'))
        .on('finish', cb);
    }
  ], done);
});