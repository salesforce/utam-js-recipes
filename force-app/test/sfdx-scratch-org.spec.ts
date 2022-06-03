/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/sfdx-scratch-org.spec.js

import Hello from '../../pageObjects/hello';
import HomePage from '../../pageObjects/homePage';
import WireGetObjectInfo from '../../pageObjects/wireGetObjectInfo';
import { TestEnvironment } from './utilities/test-environment';

describe('Scratch Org Tests', () => {
    const testEnvironment = new TestEnvironment('scratchOrg');
    let appHomePage: HomePage;

    beforeEach(async () => {
        console.log('Navigate to login URL for a scratch org');
        await browser.navigateTo(testEnvironment.sfdxLoginUrl);

        console.log('Wait for Home Page URL');
        const domDocument = utam.getCurrentDocument();
        await domDocument.waitFor(async () => (await domDocument.getUrl()).includes('Hello'));

        console.log('Wait for Application Home Page to load');
        appHomePage = await utam.load(HomePage);
    });

    it('hello: displays greeting', async () => {
        console.log('Wait for Flexipage with Hello component to load');
        const component2 = await appHomePage.getComponent();
        const hello = await component2.getContent(Hello);

        console.log('Get and assert text inside the component"');
        const text = await hello.getText();
        expect(text).toContain('Hello, World!');
    });

    it('wire: get object info for Contact', async () => {
        console.log("Click 'Wire' in app navigation menu and wait for URL navigation");
        const appNav = await appHomePage.getNavigationBar();
        const appNavBar = await appNav.getAppNavBar();
        const item = await appNavBar.getNavItem('Wire');
        await item.clickAndWaitForUrl('lightning/n/Wire');

        console.log('Wait for Flexipage with Wire component to load');
        const component2 = await appHomePage.getComponent();
        const wireInfo = await component2.getContent(WireGetObjectInfo);

        console.log("Enter search criteria and click 'Search', wait for response");
        await wireInfo.searchAndWaitForResponse('Contact');

        console.log('Get and assert response content');
        const text = await wireInfo.getContent();
        expect(text).toContain(`"apiName": "Contact"`);
    });
});
