/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import Login from 'utam-preview/pageObjects/login';

/**
 * Helper function used in crud tests to login in STMFA environment
 * @param {import("./test-environment").TestEnvironment} testEnvironment
 * @param {string} landingPagePartialUrl
 */
export async function login(testEnvironment, landingPagePartialUrl) {
    const { baseUrl, username, password } = testEnvironment;

    console.log(`Navigate to login URL: ${baseUrl}`);
    await browser.url(baseUrl);
    const login = await utam.load(Login);
    await login.loginToHomePage(username, password, landingPagePartialUrl);
}
