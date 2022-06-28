require('dotenv').config();

const EXPLICIT_TIMEOUT = 60 * 1000;
const DEBUG_TIMEOUT = EXPLICIT_TIMEOUT * 30;
const { DEBUG } = process.env;
const path = require('path');
const { UtamWdioService } = require('wdio-utam-service');

exports.baseMobileConfig = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',
    port: 4444,

    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called.
    specs: ['force-app/test/mobile/**/*.spec.js'],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.

    maxInstances: 1,
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    // timeout for all waitFor commands
    waitforTimeout: DEBUG ? DEBUG_TIMEOUT : EXPLICIT_TIMEOUT,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [
        'selenium-standalone',
        [
            UtamWdioService,
            {
                implicitTimeout: 0,
                injectionConfigs: ['salesforce-pageobjects/utam-salesforceapp-pageobjects.config.json'],
            },
        ],
    ],
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineNodeOpts: {
        // max execution time for a script, set to 5 min
        defaultTimeoutInterval: 1000 * 60 * 5,
        // Temporary workaround to get babel to work in wdio tests
        helpers: [path.resolve(process.cwd(), 'wdioJasmineHelper.js')],
    },
};
