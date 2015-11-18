var generators = require('yeoman-generator'),
    templates = require('../../templates/app'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    chalk = require('chalk');

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);

        this.option('exclude', {
            type: String,
            desc: 'Comma delimited list of folders to be excluded from ',
            defaults: ""
        });

        this.option('name', {
            type: String,
            desc: 'Name of the assets folder. Default "assets"',
            defaults: "assets"
        });

        this.option('path', {
            type: String,
            defaults: "./",
            hide: true
        });
    },

    run: function() {
        this._start();

        this._prompt(function(answer) {
            var excludes = this.options.exclude.split(',')
                .filter(function(value) {
                    return !!value;
                })
                .map(function(value) {
                    return value.trim();
                });

            if(!answer.bower) excludes.push('bower');

            var includes = Object.keys(templates)
            .filter(function(value) {
                return excludes.indexOf(value) < 0;
            });

            var self = this;

            includes.forEach(function(value) {
                var dir = path.join(self._getBaseDirectory(), value);
                console.info(chalk.green('.'));
                self._make(self.destinationPath(dir), templates[value]);
            });

            if(answer.bower) {
                var bowerDir = path.join(self._getBaseDirectory(), 'bower');
                this._make(this.destinationPath(), [{
                    name: '.bowerrc',
                    content: '{ directory: "' + bowerDir + '" }'
                }]);
            }

            this._end();
        }.bind(this));
    },

    _prompt: function(cb) {
        this.prompt({
            type: 'confirm',
            name: 'bower',
            message: 'Will you use "bower" for managing packages?',
            default: false
        }, cb);
    },

    _getBaseDirectory: function() {
        return path.join(this.options.argv.cooked[0] || this.options.path, this.options.name);
    },

    _end: function() {
        console.info(chalk.green('Done.'));
    },

    _make: function(dir, files) {
        var self = this;

        mkdirp.sync(dir);

        files.forEach(function(name) {
            var file, content;
            if(typeof name === 'string') {
                file = name;
                content = '';
            } else if(typeof name === 'object') {
                file = name.name;
                content = name.content || '';
            }

            if(file && content !== null) {
                var filePath = path.join(dir, file);

                if(!self.fs.exists(filePath)) fs.writeFileSync(filePath, content);
            }
        });
    },

    _start: function() {
        console.info(chalk.green('Generating assets folder structure to "%s"...'), this._getBaseDirectory());
    }
});