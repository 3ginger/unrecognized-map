module.exports = function(grunt) {

	grunt.initConfig({
		coffee: {
			compile: {
				options: {
					bare:true
				},
				files: {
					'tmp/user.js':'coffee/**/*.coffee'
				}
			}
		},
		stylus: {
			comlipe: {
				files: {
					'tmp/user.css':'stylus/**/*.styl'
				}
			}
		},
		concat: {
			user: {
				files: {
					'tmp/user.js':['tmp/**/*.js', 'js/*.js'],
					'tmp/user.css':['tmp/**/*.css', 'css/*.css']
				}
			},
			vendor: {
				options: {
					separator: '\n\n',
					banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
				},
				files: {
					'dist/main.min.js':['bower_components/**/*.min.js', 'tmp/user.min.js'],
				}
			}
		},
		uglify: {
			vendor: {
				files: {
					'tmp/user.min.js':'tmp/user.js'
				}
			}
		},
		cssmin: {
			vendor: {
				files: {
					'dist/main.min.css':'tmp/user.css'
				}
			}
		},
		watch: {
			files: ['coffee/**/*.coffee', 'stylus/**/*.styl', 'js/*.js', 'css/*.css'],
			tasks:['watchcompile', 'dist']
		},
		clean: {
			tmp:['tmp/*']
		}
	});

	
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-newer');


	grunt.registerTask('watchcompile', ['clean', 'newer:coffee', 'newer:stylus']);
	grunt.registerTask('compile', ['clean', 'coffee', 'stylus']);
	grunt.registerTask('dist', ['concat:user', 'uglify', 'cssmin', 'concat:vendor']);
	grunt.registerTask('default', ['compile', 'dist', 'watch']);
}

