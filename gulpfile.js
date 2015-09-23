//dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
//create *.js.map file
var sourcemaps = require('gulp-sourcemaps');
//slam multiple *.js files together
var concat = require('gulp-concat');
//shrink code to be smaller for compy
var uglify = require('gulp-uglify');
var uglifyCss = require('gulp-minify-css');
var jade = require('gulp-jade');

gulp.task('default', ['process-js',
                      'process-css',
                      'process-angular',
                      'process-angular-material-js',
                      'process-angular-material-css',
                      'process-angular-animate',
                      'process-angular-aria',
                      'process-angular-route',
                      'process-jade',
                      'process-images',
                      'process-angular-jwt',
                      'process-private-views'],
                      function(){
                        gutil.log('Gulped!');
});

gulp.task('process-js', function(){
  return gulp.src('./client/javascripts/*.js')
  .pipe(sourcemaps.init())
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('process-css', function(){
  return gulp.src('./client/styles/*.css')
  .pipe(sourcemaps.init())
  .pipe(uglifyCss())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./public/stylesheets'));
});
gulp.task('process-angular', function(){
  return gulp.src('./node_modules/angular/angular.min.*')
  .pipe(gulp.dest('./public/vendors/angularjs'));
});
gulp.task('process-angular-animate', function(){
  return gulp.src('./node_modules/angular-animate/angular-animate.min.*')
  .pipe(gulp.dest('./public/vendors/angularjs'));
});
gulp.task('process-angular-material-js', function(){
  return gulp.src('./node_modules/angular-material/angular-material.min.js')
  .pipe(gulp.dest('./public/vendors/angularjs'));
});
gulp.task('process-angular-material-css', function(){
  return gulp.src('./node_modules/angular-material/angular-material.min.css')
  .pipe(gulp.dest('./public/vendors/angularcss'))
});
gulp.task('process-angular-aria', function(){
  return gulp.src('./node_modules/angular-aria/angular-aria.min.*')
  .pipe(gulp.dest('./public/vendors/angularjs'))
});
gulp.task('process-jade', function(){
  return gulp.src('./client/partials/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./public/views'))
});
gulp.task('process-angular-route', function(){
  return gulp.src('./node_modules/angular-route/angular-route.min.*')
  .pipe(gulp.dest('./public/vendors/angularjs'))
});
gulp.task('process-images', function(){
  return gulp.src('./client/images/*.png')
  .pipe(gulp.dest('./public/images'))
});
gulp.task('process-angular-jwt', function(){
  return gulp.src('./node_modules/angular-jwt/dist/angular-jwt.min.js')
  .pipe(gulp.dest('./public/vendors/angularjs'))
});
gulp.task('process-private-views', function(){
  return gulp.src('./client/private/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./private/views'))
});

gulp.task('production', ['move-public',
                         'move-models',
                         'move-routes',
                         'move-views',
                         'move-appjs',
                         'move-packagejson',
                         'move-images',
                         'move-bin'],
                         function(){
                           gutil.log('gulp moved public')
                         })

gulp.task('move-public', function(){
  return gulp.src('./public/**/*')
  .pipe(gulp.dest('../production/public'));
});
gulp.task('move-models', function(){
  return gulp.src('./models/*')
  .pipe(gulp.dest('../production/models'));
});
gulp.task('move-routes', function(){
  return gulp.src('./routes/*')
  .pipe(gulp.dest('../production/routes'));
});
gulp.task('move-views', function(){
  return gulp.src('./views/*')
  .pipe(gulp.dest('../production/views'));
});
gulp.task('move-appjs', function(){
  return gulp.src('app.js')
  .pipe(gulp.dest('../production'));
});
gulp.task('move-packagejson', function(){
  return gulp.src('package.json')
  .pipe(gulp.dest('../production'));
});
gulp.task('move-bin', function(){
  return gulp.src('./bin/*')
  .pipe(gulp.dest('../production/bin'));
});
gulp.task('move-images', function(){
  return gulp.src('./client/images/*')
  .pipe(gulp.dest('../production/public/images'));
});
