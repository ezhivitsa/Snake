'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean:  {
            app: ['public/dist'],
            js: ['public/dist/js/*.js'],
            css: ['public/dist/css/*.css'],
            sass: ['public/app/css/*.css']
        },

        sass: {
            dist: {
                files: {
                    'public/app/css/main.css': ['public/app/sass/style.scss']
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
                    'public/app/scripts/**/*.js'
                ]
            }
        },

        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        src: ['fonts/**'],
                        cwd: 'public/app/sass/',
                        dest: 'public/app/css/'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['fonts/**'],
                        cwd: 'public/app/sass/',
                        dest: 'public/dist/css/'
                    },
                    {
                        expand: true,
                        src: [
                            'images/**',
                            '*.html',
                            'views/{,*/}*.html',
                            'templates/{,*/}*.html'
                        ],
                        cwd: 'public/app/',
                        dest: 'public/dist/'
                    }
                ]
            }
        },

        useminPrepare: {
            options: {
                dest: 'public/dist',
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
            html: 'public/app/index.html'
        },
        
        usemin: {
            options: {
                dirs: ['public/dist']
            },
            html: ['public/dist/{,*/}*.html'],
            css: ['public/dist/css/{,*/}*.css']
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
                    cwd: 'public/dist',
                    src: ['*.html', 'views/{,*/}*.html', 'templates/{,*/}*.html'],
                    dest: 'public/dist'
                }]
            }
        },

        connect: {
            options: {
                port: 8080,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '192.168.1.147',
                //hostname: 'localhost'
            },

            dist: {
                options: {
                    open: true,
                    base: 'public/app'
                }
            }
        },

        watch: {
            css: {
                files: ['public/app/sass/**/*.scss'],
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
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
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
