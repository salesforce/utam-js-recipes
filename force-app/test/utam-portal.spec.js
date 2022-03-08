/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/utam-portal.spec.js

import UtamDevHome from 'utam-preview/pageObjects/utamDevHome';
import Dummy from 'utam-preview/pageObjects/dummy';
import NullableExample from 'utam-preview/pageObjects/nullableExample';

describe('Test utam.dev portal', () => {
    beforeEach(async () => {
        console.log('Navigate to portal');
        await browser.navigateTo('https://utam.dev');
    });

    it('Menu links navigation', async () => {
        console.log('Load Home Page');
        const homePage = await utam.load(UtamDevHome);
        const menuItems = await homePage.getMenuItems();
        expect(menuItems.length).toBe(4);

        console.log('Click Grammar menu item and check navigation');
        await (await homePage.getGrammarMenuItem()).click();
        expect(await browser.getUrl()).toBe('https://utam.dev/grammar/spec');
    });

    it('Validate root element presence', async () => {
        console.log('Assert that a root page is not loaded');
        const domDocument = utam.getCurrentDocument();
        // random root page object that we know is not present
        expect(await domDocument.containsObject(Dummy)).toBeFalse();

        console.log('Assert that a root element with a given locator is not present');
        expect(await domDocument.containsElement(utam.By.css('idonotexist'))).toBeFalse();
    });

    it('Checking absence of the elements on the page', async () => {
        console.log('Load Home Page');
        const homePage = await utam.load(NullableExample);

        console.log('Non existing nullable basic element is returned as null');
        expect(await homePage.getNullableBasicElement()).toBeNull();

        console.log('Non existing nullable basic elements list is returned as null');
        expect(await homePage.getNullableBasicElementList()).toBeNull();

        console.log('Non existing nullable custom element is returned as null');
        expect(await homePage.getNullableCustomElement()).toBeNull();

        console.log('Non existing nullable custom elements list is returned as null');
        expect(await homePage.getNullableCustomElementList()).toBeNull();

        console.log('Nullable element scoped inside non existing nullable basic element is returned as null');
        expect(await homePage.getScopedInsideNullable()).toBeNull();
    });

    it('Test with stale elements', async () => {
        console.log('Confirm that everything is present and visible');
        let homePage = await utam.load(UtamDevHome);
        await homePage.waitForVisible();
        expect(await homePage.isPresent()).toBeTrue();
        expect(await homePage.isVisible());

        console.log('Get home page content, save as a variable');
        let pageContent = await homePage.getContent();
        expect(await pageContent.isPresent());

        console.log('Reload web page by navigating to its URL again');
        await browser.navigateTo('https://utam.dev');

        console.log('Because we reloaded content, all elements became stale');
        await homePage.waitForAbsence();
        expect(await homePage.isPresent()).toBeFalse();
        await pageContent.waitForAbsence();
        expect(await pageContent.isPresent()).toBeFalse();

        console.log('Reload the root to invoke Driver.findElement');
        homePage = await utam.load(UtamDevHome);
        expect(await homePage.isPresent()).toBeTrue();

        console.log('Call getter to invoke Element.findElement and assign new variable');
        pageContent = await homePage.getContent();
        expect(await pageContent.isPresent()).toBeTrue();
    });
});
