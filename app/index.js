'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var RestfullyGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('Welcome to Restfully. A RESTFUL API Generator!'));

    var prompts = [
    { type: 'list'
    , name: 'database'
    , message: 'Which database will you be using?'
    , choices: ['MySQL', 'PostgeSQL', 'Sqlite3']
    }
    ]

    this.prompt(prompts, function (props) {
      this.database = props.database;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('lib');

    this.copy('_package.json', 'package.json');
    this.npmInstall( 'bookshelf', {save: true} );
    // Install Added Dependencies
    this.npmInstall( getNPMdb(this.database), {save: true} );
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

/**
 * Get the NPM Package Name for the Database
 * @private
 * @param {string} databae
 * @returns {string} theDB
 */
function getNPMdb( database ){
  var theDB = '';
  switch( database ){
    case 'MySQL':
      theDB = 'mysql';
      break;
    case 'PostgreSQL':
      theDB = 'pg';
      break;
    case 'Sqlite3':
      theDB = 'sqlite3';
      break;
  }

  return theDB;
}

module.exports = RestfullyGenerator;
