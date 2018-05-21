module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
    },
    "globals": {
        "DEBUG": false,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": 'off',
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        'no-warning-comments': [
            'error',
            {
                terms: ['todo', 'fixme', 'bug'],
                location: 'start'
            }
        ]
    }
};