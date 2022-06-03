/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { mobileBaseConfig } = require('./wdio.conf.mobilebase');
const { UtamWdioService } = require('wdio-utam-service');

exports.sappBaseConfig = {
    ...mobileBaseConfig,
    specs: ['force-app/test/mobile/salesforceapp/*.spec.js'],
    services: [
        [
            'appium',
            {
                command: 'appium',
            },
        ],
        [
            UtamWdioService,
            {
                implicitTimeout: 0,
                injectionConfigs: ['salesforce-pageobjects/utam-salesforceapp-pageobjects.config.json'],
            },
        ],
    ],
};
