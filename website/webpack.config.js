const path = require('path');

module.exports = {
    entry: './script.js', // your main JavaScript file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, ''),
    },
    mode: 'production',
};
