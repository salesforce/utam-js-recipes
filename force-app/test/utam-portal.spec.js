/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/utam-portal.spec.js

import Frame from 'utam-preview/pageObjects/frame';
import UtamDevHome from 'utam-preview/pageObjects/utamDevHome';

describe('Test utam.dev portal', () => {
    /*
    it('test basic', async() => {
        await browser.navigateTo('https://utam.dev');
        const devHome = await utam.load(UtamDevHome);
        const careers = await devHome.getCareers();
        await careers.click();
        const doc = utam.getCurrentDocument();
        expect(await doc.getUrl()).toBe("foo");
    });
    */

    it('test', async () => {
        await browser.navigateTo('https://iframetester.com/?url=https://utam.dev');
        const page = await utam.load(Frame);
        const frame = await page.getIframeWindow();
        await utam.enterFrame(frame);
        const devHome = await utam.load(UtamDevHome);
        const careers = await devHome.getCareers();
        await careers.click();
        await utam.waitFor(
            () => {
                return new Promise((r) => setTimeout(r, 5000));
            },
            { interval: 1000, timeout: 10000 },
        );
    });
});
