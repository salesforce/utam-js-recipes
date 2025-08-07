/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import Login from 'salesforce-pageobjects/helpers/pageObjects/login';
import RecordActionWrapper from 'salesforce-pageobjects/global/pageObjects/recordActionWrapper';
import ObjectHome from 'salesforce-pageobjects/lists/pageObjects/objectHome';

/**
 * Helper function used in crud tests to login in STMFA environment
 * @param {import("./test-environment").TestEnvironment} testEnvironment
 * @param {string} landingPagePartialUrl
 */
export async function login(testEnvironment, landingPagePartialUrl) {
    const { baseUrl, username, password } = testEnvironment;

    console.log(`Navigate to login URL: ${baseUrl}`);
    await browser.url(baseUrl);
    const loginPage = await utam.load(Login);
    await loginPage.login(username, password);
    const document = utam.getCurrentDocument();
    await document.waitFor(async () => {
        const docUrl = await document.getUrl();
        return docUrl.includes(landingPagePartialUrl);
    });
}

/**
 * Utility function that open a given record type modal
 * @param {string} baseUrl test environment
 * @param {import("./record-type").RecordType} recordType type of record used in the UI test
 * @returns {Promise<RecordActionWrapper>} instance of the record modal Page Object
 */
export async function openRecordModal(baseUrl, recordType) {
    console.log(`Navigate to an Object Home for ${recordType.name}`);
    await browser.navigateTo(recordType.getObjectHomeUrl(baseUrl));
    console.log(`Load ${recordType.name} Object Home page`);
    const objectHome = await utam.load(ObjectHome);
    await objectHome.waitFor(async () => (await objectHome.getListViewManager()).isPresent());
    const listViewManager = await objectHome.getListViewManager();
    await listViewManager.waitFor(async () => (await listViewManager.getCommonListInternal()).isPresent());
    const listView = await listViewManager.getCommonListInternal();
    const listViewHeader = await listView.getHeader();

    console.log("List view header: click button 'New'");
    const actionsContainer = await listViewHeader.getAuraActionsContainer();
    const actionLink = await actionsContainer.getActionLink('New');
    await actionLink.click();

    console.log('Load Record Form Modal');
    const recordFormModal = await utam.load(RecordActionWrapper);
    const isRecordFormModalPresent = await recordFormModal.isPresent();
    expect(isRecordFormModalPresent).toBe(true);
    return recordFormModal;
}
