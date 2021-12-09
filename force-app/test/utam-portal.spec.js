/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/utam-portal.spec.js

import UtamDevHome from 'utam-preview/pageObjects/utamDevHome';

describe('Test utam.dev portal', () => {
    beforeEach(async () => {
        console.log('Navigate to portal');
        await browser.navigateTo('https://utam.dev');
    });

    it('Menu links navigation', async () => {
        console.log('Load Home Page');
        const homePage = await utam.load(UtamDevHome);
        const menuItems = await homePage.getMenuItems();
        expect(menuItems.length).toBe(3);

        console.log('Click Grammar menu item and check navigation');
        await (await homePage.getGrammarMenuItem()).click();
        expect(await browser.getUrl()).toBe('https://utam.dev/grammar/spec');
    });
});
