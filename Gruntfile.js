/*jshint camelcase: false*/
// Generated on 2013-05-22 using generator-chrome-extension 0.1.1
'use strict';
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            test: {
                options: {
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS']
            },
            continuous: {
                background: true
            },
            unit: {
                singleRun: true
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        'images/{,*/}*.{webp,gif}',
                        '_locales/{,*/}*.json'
                    ]
                }]
            }
        },
        compress: {
            dist: {
                options: {
                    archive: 'package/chromedo.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
        },
        regarde: {
            lib_test: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js', 'test/{,*/}*.js'],
                tasks: ['karma:continuous:run']
            }
        }
    });

    grunt.registerTask('test', ['karma:unit']);

    grunt.registerTask('watch', ['karma:continuous', 'regarde']);

    grunt.registerTask('prepareManifest', function() {
        var scripts = [];
        var concat = grunt.config('concat') || {
            dist: {
                files: {}
            }
        };
        var uglify = grunt.config('uglify') || {
            dist: {
                files: {}
            }
        };
        var manifest = grunt.file.readJSON(yeomanConfig.app + '/manifest.json');

        if (manifest.background.scripts) {
            manifest.background.scripts.forEach(function(script) {
                scripts.push(yeomanConfig.app + '/' + script);
            });
            concat.dist.files['<%= yeoman.dist %>/scripts/background.js'] = scripts;
            uglify.dist.files['<%= yeoman.dist %>/scripts/background.js'] = '<%= yeoman.dist %>/scripts/background.js';
        }

        if (manifest.content_scripts) {
            manifest.content_scripts.forEach(function(contentScript) {
                if (contentScript.js) {
                    contentScript.js.forEach(function(script) {
                        uglify.dist.files['<%= yeoman.dist %>/' + script] = '<%= yeoman.app %>/' + script;
                    });
                }
            });
        }

        grunt.config('concat', concat);
        grunt.config('uglify', uglify);
    });

    grunt.registerTask('manifest', function() {
        var manifest = grunt.file.readJSON(yeomanConfig.app + '/manifest.json');
        manifest.background.scripts = ['scripts/background.js'];
        grunt.file.write(yeomanConfig.dist + '/manifest.json', JSON.stringify(manifest, null, 2));
    });

    grunt.registerTask('build', [
        'clean:dist',
        'prepareManifest',
        'concat',
        'uglify',
        'copy',
        'manifest',
        'compress'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
