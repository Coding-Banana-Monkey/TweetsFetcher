const gulp = require('gulp');
const execSync = require('child_process').execSync;
const clean = require('gulp-clean');
const fs = require('fs');
const config = require('./src/config');

gulp.task('default', ['download'], () => {
    gulp.start('deduplicate');
});

gulp.task('clean', () => {
    return gulp.src(config.downloadDir, { read: false })
        .pipe(clean());
});

gulp.task('download', ['clean'], () => {
    fs.mkdirSync(config.downloadDir);
    execSync('node ./src/tweets-datastore.js', { stdio: 'inherit' });
});

gulp.task('deduplicate', () => {
    execSync('node ./src/deduplicator.js', { stdio: 'inherit' });
});

gulp.task('verify', () => {
    execSync('node ./src/result-verifier.js', { stdio: 'inherit' });
});