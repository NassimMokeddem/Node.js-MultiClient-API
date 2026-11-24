'use strict'

module.exports = {
    root: true,
    extends: 'usecases/usecase/nodejs',
    rules: {
        'no-sync': 'off',
    },
    env: {
        jest: true,
        browser: true,
        node: true,
    },
}