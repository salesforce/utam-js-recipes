/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/app-navigation.spec.js

import ApplicationHome from 'salesforce-pageobjects/navex/pageObjects/desktopLayoutContainer';
import { login } from './utilities/salesforce-test';
import { TestEnvironment } from './utilities/test-environment';

// TODO: replace with prefix of the environment from .env file
const TEST_ENVIRONMENT_PREFIX = 'na44';

describe('Sales app navigation tests', () => {
    const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);

    it('Application bar navigation', async () => {
        await login(testEnvironment, testEnvironment.redirectUrl);
        console.log('Load Home Page');
        const homePage = await utam.load(ApplicationHome);
        const appNav = await homePage.getAppNav();
        const appNavBar = await appNav.getAppNavBar();
        const navItem = await appNavBar.getNavItem('Accounts');
        console.log('Click "Accounts" and wait for account home to load');
        await navItem.clickAndWaitForUrl('Account');
    });
});
