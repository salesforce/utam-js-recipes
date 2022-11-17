/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import AddCommunity from 'salesforce-pageobjects/playgroundapp/pageObjects/authentication/addCommunity';
import Blogs from 'salesforce-pageobjects/playgroundapp/pageObjects/navigation/blogs';
import Eula from 'salesforce-pageobjects/playgroundapp/pageObjects/authentication/eula';
import Home from 'salesforce-pageobjects/playgroundapp/pageObjects/navigation/home';
import NavTabBar from 'salesforce-pageobjects/playgroundapp/pageObjects/navigation/navTabBar';

/**
 * @param {string} communityURL
 */
async function updateCommunity(communityURL) {
    const prefix = 'https://';
    const addCommunity = await utam.load(AddCommunity);
    await addCommunity.addCommunityUrl(browser.isAndroid ? communityURL : prefix.concat(communityURL));
}

const SAMPLE_COMMUNITY = 'mobpub-recipes.my.site.com/capricornjuices/s/';

describe('Test Community Playground App', () => {
    it('testNavigation', async () => {
        // Accept Eula
        const eula = await utam.load(Eula);
        await eula.accept();
        // Setup community
        await updateCommunity(SAMPLE_COMMUNITY);

        // Navigate to Blog
        let tabBar = await utam.load(NavTabBar);
        await tabBar.clickTabBarItem('Blog');
        utam.setBridgeAppTitle('All Blogs Final');
        const blogs = await utam.load(Blogs);
        await blogs.waitForBlogPostCellList();
        const blogList = await blogs.getBlogPostCellList();
        expect((await blogList.getBlogPostCells()).length).toBeGreaterThan(0);

        // Navigate to Home
        tabBar = await utam.load(NavTabBar);
        await tabBar.clickTabBarItem('Home');
        utam.setBridgeAppTitle('Home');
        const home = await utam.load(Home);
        await home.clickShopNow();
        await home.clickReadMore();
    });
});
