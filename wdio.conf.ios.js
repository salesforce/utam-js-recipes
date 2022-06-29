/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { baseMobileConfig } = require('./wdio.conf.shared');

exports.config = {
    ...baseMobileConfig,
    capabilities: [
        {
            platformName: 'iOS',
            'appium:autoWebview': true,
            'appium:deviceName': 'iPhone 12',
            'appium:app': '<path to iOS test app>',
            'appium:automationName': 'XCUITest',
            'appium:platformVersion': '15.2',
        },
    ],
};
