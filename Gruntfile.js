var loadTasks = require('load-grunt-tasks');

var babel = [{
  expand: true,
  cwd: 'src/',
  src: '**',
  dest: 'lib/'
}];

module.exports = function gruntConfig(grunt) {
  loadTasks(grunt);

  grunt.initConfig({
    watch: {
      files: [
        '.eslintrc',
        'spec/.eslintrc',
        'gruntfile.js',
        'lib/**/*.js',
        'spec/**/*.js'
      ],
      tasks: [
        'babel:dev',
        'clear', 'test',
        'clear', 'eslint',
        'clear', 'integration'
      ]
    },

    babel: {
      dev: {
        files: babel,
        options: { sourceMap: true }
      },
      dist: { files: babel }
    },

    eslint: {
      target: [
        'Gruntfile.js',
        'lib/*.js',
        'spec/*.js'
      ]
    },

    jasmine_nodejs: {
      options: {
        specNameSuffix: 'spec.js',
        helperNameSuffix: 'helper.js',
        useHelpers: true,
        stopOnFailure: true,
        reporters: {
          console: {
            colors: true,
            cleanStack: 1,
            verbosity: 4,
            listStyle: 'indent',
            activity: false
          }
        }
      },
      your_target: {
        specs: [
          'spec/**/*.js'
        ],
        helpers: [
          'spec/helpers/**'
        ]
      }
    },

    exec: {
      integration: 'npm run integration'
    }
  });

  grunt.registerTask('test', ['jasmine_nodejs']);
  grunt.registerTask('integration', ['exec:integration']);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('default', ['test', 'eslint']);
};
