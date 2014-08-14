'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean:  {
            app: ['app/dist'],
            js: ['app/dist/js/*.js'],
            css: ['app/dist/css/*.css']
        },

        sass: {
            dist: {
                files: {
                    'app/dist/css/main.css': ['app/sass/style.scss']
                }
            }
        },

        cssmin: {
            with_banner: {
                options: {
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    'app/dist/css/main.min.css': ['app/dist/css/main.css']
                }
            }   
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    console: true,
                    angular: true
                }
            },
            all: {
                src: [
                    'app/scripts/**/*.js'
                ]
            }
        },

        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        src: ['fonts/**'],
                        cwd: 'app/sass/',
                        dest: 'app/dist/css/'
                    }
                ]
            }
        },

        'angular-builder': {
            options: {
                mainModule: 'snakeApp'
            },
            application: {
                files: [
                    {
                        src:  ['app/vendor/**/*.js', 'app/scripts/**/*.js'],
                        dest: 'app/dist/js/build.js'
                    }
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },

            dist: {
                options: {
                    open: true,
                    base: 'app'
                }
            }
        },

        watch: {
            scrips: {
                files: ['app/scripts/**/*.js'],
                tasks: ['clean:js', 'angular-builder']
            },
            css: {
                files: ['app/sass/**/*.scss'],
                tasks: ['clean:css', 'copy:fonts', 'sass', 'cssmin']
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-angular-builder");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-connect");

    grunt.registerTask('build', ['clean', 'copy:fonts', 'sass', 'cssmin', 'angular-builder']);
    grunt.registerTask('w', ['connect', 'clean:app', 'copy:fonts', 'sass', 'cssmin', 'angular-builder', 'watch']);
};
