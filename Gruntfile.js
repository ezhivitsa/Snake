'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean:  {
            app: ['dist'],
            js: ['dist/js/*.js'],
            css: ['dist/css/*.css'],
            sass: ['app/css/*.css']
        },

        sass: {
            dist: {
                files: {
                    'app/css/main.css': ['app/sass/style.scss']
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
                        dest: 'app/css/'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['fonts/**'],
                        cwd: 'app/sass/',
                        dest: 'dist/css/'
                    },
                    {
                        expand: true,
                        src: [
                            'images/**',
                            '*.html',
                            'views/{,*/}*.html',
                            'templates/{,*/}*.html'
                        ],
                        cwd: 'app/',
                        dest: 'dist/'
                    }
                ]
            }
        },

        useminPrepare: {
            options: {
                dest: 'dist',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            },
            html: 'app/index.html'
        },
        
        usemin: {
            options: {
                dirs: ['dist']
            },
            html: ['dist/{,*/}*.html'],
            css: ['dist/css/{,*/}*.css']
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.html', 'views/{,*/}*.html', 'templates/{,*/}*.html'],
                    dest: 'dist'
                }]
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
            css: {
                files: ['app/sass/**/*.scss'],
                tasks: ['clean:sass', 'copy:fonts', 'sass']
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-usemin");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('build', [
        'clean', 
        'copy:dist', 
        'sass', 
        'cssmin',
        'angular-builder',
        'useminPrepare',
        'concat',
        'uglify',
        'usemin'
    ]);

    grunt.registerTask('w', [
        'connect',
        'clean:sass',
        'sass',
        'copy:fonts',
        'watch'
    ]);
};
