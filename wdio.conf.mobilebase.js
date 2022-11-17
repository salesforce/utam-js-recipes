/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

require('dotenv').config();

const EXPLICIT_TIMEOUT = 60 * 1000;
const DEBUG_TIMEOUT = EXPLICIT_TIMEOUT * 30;
const { DEBUG } = process.env;
const path = require('path');
const { UtamWdioService } = require('wdio-utam-service');

exports.mobileBaseConfig = {
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
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineNodeOpts: {
        // max execution time for a script, set to 5 min
        defaultTimeoutInterval: 1000 * 60 * 5,
        // Temporary workaround to get babel to work in wdio tests
        helpers: [path.resolve(process.cwd(), 'wdioJasmineHelper.js')],
    },
};
