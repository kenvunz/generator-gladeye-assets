var helpers = require('yeoman-generator').test,
    path = require('path'),
    assert = require('yeoman-generator').assert,
    templates = require('../templates/app');

describe('gladeye-assets', function() {
    describe('with default options', function() {
        var generator;

        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({bower: false})
            .on('ready', function(instance) {
                generator = instance;
            })
            .on('end', done);
        });

        it('should have all files/folders in templates', function() {
            var dirs = Object.keys(templates),
                files = [];

            dirs.forEach(function(dir) {
                if(dir === 'bower') return;
                files = files.concat(collect(generator, dir, templates));
            });

            assert.file(files);
        });
    });

    describe('with bower', function() {
        var generator;

        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({bower: true})
            .on('ready', function(instance) {
                generator = instance;
            })
            .on('end', done);
        });

        it('should have all files/folders in templates', function() {
            var dirs = Object.keys(templates),
                files = [];

            dirs.forEach(function(dir) {
                files = files.concat(collect(generator, dir, templates));
            });

            assert.file(files);
        });

        it('should has a ".bowerrc" file', function() {
            assert.file[generator.destinationPath('.bowerrc')];
        });
    });
});

function collect(generator, dir, templates) {
    var p = generator.destinationPath(path.join(generator._getBaseDirectory(), dir)),
        files = templates[dir] || [],
        collection = [];

    files.forEach(function(value) {
        if(typeof value === 'string') collection.push(path.join(p, value));
        else if(typeof value === 'object') collection.push(path.join(p, value.name));
    });

    return collection;
}