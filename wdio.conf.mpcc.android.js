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
            platformName: 'Android',
            'appium:orientation': 'PORTRAIT',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': 'emulator-5554',
            // TODO: replace with the test application path in your local
            'appium:app': '<path to Android test app>',
            'appium:appActivity': 'com.mysalesforce.community.startgate.StartActivity',
            'appium:appPackage': 'com.mysalesforce.mycommunity.playgroundcommunity',
            'appium:newCommandTimeout': 240,
        },
    ],
};
