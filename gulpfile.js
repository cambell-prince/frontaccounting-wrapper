var gulp = require('gulp');
var gutil = require('gulp-util');
var exec2 = require('child_process').exec;
var exec = require('gulp-exec');
var async = require('async');

var execute = function(command, callback) {
  gutil.log(gutil.colors.green(command));
  exec2(command, function(err, stdout, stderr) {
    gutil.log(stdout);
    gutil.log(gutil.colors.yellow(stderr));
    callback(err);
  });
};

var paths = {
  src: ['htdocs/**/*.inc', 'htdocs/**/*.php', '!htdocs/vendor/**'],
  test: ['tests/**/*.php']
};

// livereload
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

var srcTheme = [
    'htdocs/wp/wp-content/themes/ttp-wp-theme/views/*.twig',
    'htdocs/wp/wp-content/themes/ttp-wp-theme/*.php',
    'htdocs/wp/wp-content/themes/ttp-wp-theme/*.css',
    'htdocs/wp/wp-content/themes/ttp-wp-theme/css/*.css',
    'htdocs/wp/wp-content/themes/ttp-wp-theme/js/*.js'
];

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('do-reload', function() {
  return gulp.src('htdocs/wp/index.php').pipe(livereload(server));
});

gulp.task('reload', function() {
  server.listen(35729, function(err) {
    if (err) {
      return console.log(err);
    }
    gulp.watch(srcTheme, [ 'do-reload' ]);
  });
});

gulp.task('upload', function() {
  var options = {
    silent : false,
    src : "htdocs",
    dest : "root@saygoweb.com:/var/www/virtual/saygoweb.com/bms/htdocs/",
    key : "~/.ssh/dev_rsa"
  };
  gulp.src('htdocs')
    .pipe(exec(
      'rsync -rzlt --chmod=Dug=rwx,Fug=rw,o-rwx --delete --exclude-from="upload-exclude.txt" --stats --rsync-path="sudo -u vu2006 rsync" --rsh="ssh -i <%= options.key %>" <%= options.src %>/ <%= options.dest %>',
      options
    ));
});
/*
 * /c/src/cygwin64/bin/rsync.exe -vaz --rsh="ssh -i ~/ssh/dev-cp-private.key" *
 * root@saygoweb.com:/var/www/virtual/saygoweb.com/bms/htdocs/
 */
gulp.task('db-backup', function() {
  var options = {
    silent : false,
    dest : "root@bms.saygoweb.com",
    key : "~/.ssh/dev_rsa",
    password : process.env.password
  };
  gulp.src('')
    .pipe(exec(
      'mysqldump -u cambell --password=<%= options.password %> saygoweb_fa | gzip > backup/current.sql.gz',
      options
    ));
});

gulp.task('db-restore', function() {
  var options = {
    silent : false,
    dest : "root@bms.saygoweb.com",
    key : "~/.ssh/dev_rsa",
    password : process.env.password
  };
  gulp.src('')
    .pipe(exec(
      'gunzip -c backup/current.sql.gz | mysql -u cambell --password=<%= options.password %> -D saygoweb_fa',
      options
    ));
});

gulp.task('db-copy', function() {
  var options = {
    silent : false,
    dest : "root@bms.saygoweb.com",
    key : "~/.ssh/dev_rsa",
    password : process.env.password
  };
  gulp.src('')
      .pipe(exec(
        'ssh -C -i <%= options.key %> <%= options.dest %> mysqldump -u cambell --password=<%= options.password %> saygoweb_fa | mysql -u cambell --password=<%= options.password %> -D saygoweb_fa',
        options
      ));
});

gulp.task('test', function(cb) {
  execute('/usr/bin/env php htdocs/vendor/bin/phpunit tests/*_Test.php', function(err) {
    cb(null); // Swallow the error propagation so that gulp doesn't display a nodejs backtrace.
  });
});

gulp.task('watch', function() {
  gulp.watch([paths.src, paths.test], ['test']);
});
