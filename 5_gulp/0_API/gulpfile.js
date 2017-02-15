var gulp = require('gulp');

gulp.task('default', () => {
	// 文件被写入build/**/*.js
	gulp.src('client/js/**/*.js').pipe(gulp.dest('build'));

	// 文件被写入build/js/**/*.js
	gulp.src('client/js/**/*.js', {
		base: 'client'
	}).pipe(gulp.dest('build'));
});