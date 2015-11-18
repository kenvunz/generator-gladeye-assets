var eol = require('os').EOL;

module.exports = {
    'compiled': [{
        'name': '.gitignore',
        'content': ['*', '!.gitignore'].join(eol)
    }],
    'documents': ['.gitkeep'],
    'fonts': ['.gitkeep'],
    'images': ['.gitkeep'],
    'scripts': ['.gitkeep'],
    'styles': ['.gitkeep'],
    'vendors': ['.gitkeep'],
    'videos': ['.gitkeep'],
    'bower': ['.gitkeep']
};