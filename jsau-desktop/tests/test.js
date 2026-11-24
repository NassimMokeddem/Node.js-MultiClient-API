'use strict'

const {app} = require('electron')
//const path = require('node:path')

/*eslint-disable no-unused-vars*/
const service = require('../src/main')

jest.mock('electron', () => ({
    app: {
        commandLine: {
            appendSwitch: jest.fn(),
        },
        whenReady: jest.fn(() => Promise.resolve()),
        on: jest.fn(),
    },
    BrowserWindow: jest.fn(() => ({
        loadFile: jest.fn(),
    })),
}))

describe('main.js', () => {
    it('should test certificate', () => {
        expect(app.commandLine.appendSwitch).toHaveBeenCalledWith('ignore-certificate-errors')
    })
})