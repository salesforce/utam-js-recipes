/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { mpccBaseConfig } = require('./wdio.conf.mpccbase');

exports.config = {
    ...mpccBaseConfig,
    capabilities: [
        {
            platformName: 'iOS',
            'appium:autoWebview': true,
            'appium:deviceName': 'iPhone 12',
            // TODO: replace with the test application path in your local
            'appium:app': '<path to iOS test app>',
            'appium:automationName': 'XCUITest',
            'appium:platformVersion': '15.2',
        },
    ],
};
