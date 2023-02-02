/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import ChooseConn from 'salesforce-pageobjects/salesforceapp/pageObjects/authentication/chooseConn';
import Eula from 'salesforce-pageobjects/salesforceapp/pageObjects/authentication/eula';
import Login from 'salesforce-pageobjects/helpers/pageObjects/login';
import LoginNavBar from 'salesforce-pageobjects/salesforceapp/pageObjects/authentication/loginNavBar';
import LoginNavBarOptions from 'salesforce-pageobjects/salesforceapp/pageObjects/authentication/loginNavBarOptions';

describe('Test Salesforce App', () => {
    it('testLogin', async () => {
        const eula = await utam.load(Eula);
        await eula.accept();

        const loginNavBar = await utam.load(LoginNavBar);
        await loginNavBar.chooseConnOption();

        if (browser.isAndroid) {
            const options = await utam.load(LoginNavBarOptions);
            await options.changeServer();
        }

        const choosConn = await utam.load(ChooseConn);
        await choosConn.switchConnection('Sandbox');

        if (browser.isAndroid) {
            browser.back();
        }

        utam.setBridgeAppTitle('Login | Salesforce');
        // eslint-disable-next-line no-unused-vars
        const login = await utam.load(Login);
    });
});
