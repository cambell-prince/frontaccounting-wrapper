var gulp = require('gulp');
var gutil = require('gulp-util');
var exec2 = require('child_process').exec;
var async = require('async');
var template = require('lodash.template');
var rename = require("gulp-rename");

var execute = function(command, options, callback) {
  if (options == undefined) {
    options = {};
  }
  command = template(command, options);
  if (!options.silent) {
    gutil.log(gutil.colors.green(command));
  }
  if (!options.dryRun) {
    exec2(command, function(err, stdout, stderr) {
      gutil.log(stdout);
      gutil.log(gutil.colors.yellow(stderr));
      callback(err);
    });
  } else {
    callback(null);
  }
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

gulp.task('upload', function(cb) {
  var options = {
    dryRun: true,
    silent : false,
    src : "htdocs",
    dest : "root@saygoweb.com:/var/www/virtual/saygoweb.com/bms/htdocs/",
    key : "~/.ssh/dev_rsa"
  };
  execute(
    'rsync -rzlt --chmod=Dug=rwx,Fug=rw,o-rwx --delete --exclude-from="upload-exclude.txt" --stats --rsync-path="sudo -u vu2006 rsync" --rsh="ssh -i <%= key %>" <%= src %>/ <%= dest %>',
    options,
    cb
  );
});
/*
 * /c/src/cygwin64/bin/rsync.exe -vaz --rsh="ssh -i ~/ssh/dev-cp-private.key" *
 * root@saygoweb.com:/var/www/virtual/saygoweb.com/bms/htdocs/
 */
gulp.task('db-backup', function(cb) {
  var options = {
    dryRun: true,
    silent : false,
    dest : "root@bms.saygoweb.com",
    key : "~/.ssh/dev_rsa",
    password : process.env.password
  };
  execute(
    'mysqldump -u cambell --password=<%= password %> saygoweb_fa | gzip > backup/current.sql.gz',
    options,
    cb
  );
});

gulp.task('db-restore', function(cb) {
  var options = {
    dryRun: true,
    silent : false,
    dest : "root@bms.saygoweb.com",
    key : "~/.ssh/dev_rsa",
    password : process.env.password
  };
  execute(
    'gunzip -c backup/current.sql.gz | mysql -u cambell --password=<%= password %> -D saygoweb_fa',
    options,
    cb
  );
});

gulp.task('db-copy', function(cb) {
  var options = {
    dryRun : true,
    silent : false,
    dest : "root@bms.saygoweb.com",
    key : "~/.ssh/dev_rsa",
    password : process.env.password
  };
  execute(
    'ssh -C -i <%= key %> <%= dest %> mysqldump -u cambell --password=<%= password %> saygoweb_fa | mysql -u cambell --password=<%= password %> -D saygoweb_fa',
    options,
    cb
  );
});

gulp.task('env-installProtractor', function(cb) {
  execute(
    'sudo npm install -g protractor', null, cb
  );
});

gulp.task('env-checkoutFrontAccounting', function() {

});

gulp.task('env-db', function(cb) {
  gulp.src('tests/data/config_db_test.php')
    .pipe(rename('config_db.php'))
    .pipe(gulp.dest('htdocs/'));
  execute(
      'gunzip -c tests/data/fa_test.sql.gz | mysql -u travis -D fa_test',
      null,
      cb
    );
});

gulp.task('env-server', function(cb) {
  execute('php -S localhost:8000 -t htdocs &', null, cb);
})

gulp.task('test-e2e', function(cb) {
  execute(
    'protractor tests/e2e/phantom-conf.js',
    null,
    cb
  );
});

gulp.task('test-restore', function() {
  gulp.src('htdocs/config_db_normal.php')
    .pipe(rename('config_db.php'))
    .pipe(gulp.dest('htdocs/'));
});

gulp.task('test', function(cb) {
  execute('/usr/bin/env php htdocs/vendor/bin/phpunit tests/*_Test.php', null, function(err) {
    cb(null); // Swallow the error propagation so that gulp doesn't display a nodejs backtrace.
  });
});

gulp.task('watch', function() {
  gulp.watch([paths.src, paths.test], ['test']);
});
