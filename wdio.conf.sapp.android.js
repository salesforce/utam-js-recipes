/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { sappBaseConfig } = require('./wdio.conf.sappbase');

exports.config = {
    ...sappBaseConfig,
    capabilities: [
        {
            platformName: 'Android',
            'appium:orientation': 'PORTRAIT',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': 'emulator-5554',
            // TODO: replace with the test application path in your local
            'appium:app': '<path to Android test app>',
            'appium:appActivity': 'com.salesforce.chatter.Chatter',
            'appium:appPackage': 'com.salesforce.chatter',
            'appium:newCommandTimeout': 240,
        },
    ],
};
