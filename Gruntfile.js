var request = require('request');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('generate-icons-snippets', function () {
    grunt.log.ok('Loading latest icon names');

    var done = this.async();

    request({
      url: 'https://raw.githubusercontent.com/driftyco/ionicons/v2.0.1/builder/build_data.json',
      headers: {
        'User-Agent': 'Just/ListingDirectory'
      }
    }, function (error, response, body) {
      var json;

      try {
        json = JSON.parse(body);
      } catch (stringError) {
        grunt.log.error(stringError);

        done();
        return;
      }

      if (!error && response.statusCode == 200) {
        grunt.file.delete('icons/');

        json.icons.forEach(function (value) {
          grunt.file.write('icons/' + json.prefix + value.name + '.sublime-snippet',
            ['<snippet>',
              '<content><![CDATA[' + json.prefix + value.name + '${0: icon}]]></content>',
              '<!-- Optional: Set a tabTrigger to define how to trigger the snippet -->',
              '<tabTrigger>ionic-icon-' + value.name + '</tabTrigger>',
              '<!-- Optional: Set a scope to limit where the snippet will trigger -->',
              '<!-- <scope></scope> -->',
            '</snippet>'].join(''));
        });

        grunt.log.oklns(json.icons.length + ' snippets generated :o');
      } else {
        grunt.log.error('Something went wrong, GitHub API message: ' + json.message + ' statusCode: ' + response.statusCode);
      }

      done();
    });
  });

  grunt.registerTask('build', ['generate-icons-snippets']);
};
