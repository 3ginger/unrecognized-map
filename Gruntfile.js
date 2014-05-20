module.exports = function (grunt) {

    grunt.initConfig({
        coffee: {
            compile: {
                options: {
                    bare: true
                },
                files: {
                    'tmp/user.js': 'coffee/**/*.coffee'
                }
            }
        },
        stylus: {
            comlipe: {
                files: {
                    'tmp/user.css': 'stylus/**/*.styl'
                }
            }
        },
        concat: {
            user: {
                files: {
                    'tmp/user.js': ['tmp/**/*.js', 'js/**/*.js'],
                    'tmp/user.css': ['tmp/**/*.css', 'css/**/*.css']
                }
            },
            vendor: {
                options: {
                    separator: '\n\n',
                    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
                },
                files: {
                    'dist/main.min.js': ['bower_components/**/*.min.js', 'tmp/user.min.js']
                }
            }
        },
        uglify: {
            user: {
                files: {
                    'tmp/user.min.js': 'tmp/user.js'
                }
            },
            vendor:{
                files:{
                    'bower_components/underscore/underscore.min.js': 'bower_components/underscore/underscore.js'
                }
            }
        },
        cssmin: {
            vendor: {
                files: {
                    'dist/main.min.css': 'tmp/pre.user.css'
                }
            }
        },
        watch: {
            files: ['coffee/**/*.coffee', 'stylus/**/*.styl', 'js/*.js', 'css/*.css'],
            tasks: ['watchcompile', 'dist']
        },
        clean: {
            tmp: ['tmp/*']
        },
        autoprefixer: {
            options: {

            },
            files: {
                src: 'tmp/user.css',
                dest: 'tmp/pre.user.css'
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-newer');


    grunt.registerTask('watchcompile', ['clean', 'newer:coffee', 'newer:stylus']);
    grunt.registerTask('compile', ['clean', 'coffee', 'stylus']);
    grunt.registerTask('dist', ['concat:user', 'uglify:user', 'autoprefixer', 'cssmin', 'concat:vendor']);
    grunt.registerTask('default', ['uglify:vendor', 'compile', 'dist', 'watch']);
};

