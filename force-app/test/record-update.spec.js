/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/record-update.spec.js

import RecordHomeFlexipage2 from 'salesforce-pageobjects/global/pageObjects/recordHomeFlexipage2';
import RecordActionWrapper from 'salesforce-pageobjects/global/pageObjects/recordActionWrapper';
import Tab2 from 'salesforce-pageobjects/flexipage/pageObjects/tab2';
import { RecordType } from './utilities/record-type';
import { login } from './utilities/salesforce-test';
import { TestEnvironment } from './utilities/test-environment';

// TODO: replace with prefix of the environment from .env file
const TEST_ENVIRONMENT_PREFIX = 'na44';

describe('Record update test', () => {
    const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);

    /**
     * Utility function that returns a given record URL
     * @param {RecordType} recordType type of record used in the UI test
     * @param {string} recordId id of the record for which we are getting the URL
     */
    async function gotoRecordHomeByUrl(recordType, recordId) {
        const recordHomeUrl = recordType.getRecordHomeUrl(testEnvironment.redirectUrl, recordId);
        console.log(`Navigate to the Record Home by URL: ${recordHomeUrl}`);
        await browser.navigateTo(recordHomeUrl);
    }

    /**
     * Case-insensitive equality comparaison between two strings
     * @param {string} str1 first string to compare
     * @param {string} str2 other string to compare
     * @returns {boolean} true if the string are equals, false otherwise
     */
    const equalsIgnoreCase = (str1, str2) => str1.toLowerCase() === str2.toLowerCase();

    beforeAll(async () => {
        await login(testEnvironment, 'home');
    });

    it('Update an existing Account Record', async () => {
        await gotoRecordHomeByUrl(RecordType.Account, testEnvironment.accountId);

        console.log('Load Accounts Record Home page');
        const recordHome = await utam.load(RecordHomeFlexipage2);

        console.log('Access Record Highlights panel');
        const highlightsPanel = await recordHome.getHighlights();

        console.log("Wait for button 'Edit' and click on it");
        const actionsRibbon = await highlightsPanel.getActions();
        const editButton = await actionsRibbon.getActionRendererWithTitle('Edit');
        await editButton.clickButton();

        console.log('Load Record Form Modal');
        const recordFormModal = await utam.load(RecordActionWrapper);
        const recordForm = await recordFormModal.getRecordForm();
        const recordLayout = await recordForm.getRecordLayout();

        console.log('Access record form item by index');
        const item = await recordLayout.getItem(1, 2, 1);

        console.log('Enter updated account name');
        const accountName = 'Utam';
        const input = await item.getTextInput();
        await input.setText(accountName);

        console.log('Save updated record');
        await recordForm.clickFooterButton('Save');
        await recordFormModal.waitForAbsence();
    });

    it('Inline edit existing Contact Record', async () => {
        async function gotToRecordDetailsTab() {
            console.log('Load Record Home page');
            const recordHome = await utam.load(RecordHomeFlexipage2);
            const tabset = await recordHome.getTabset();

            const detailsTabLabel = 'Details';
            console.log('Select "Details" tab');
            const tabBar = await tabset.getTabBar();
            const activeTabName = await tabBar.getActiveTabText();
            if (!equalsIgnoreCase(activeTabName, detailsTabLabel)) {
                await tabBar.clickTab(detailsTabLabel);
            }
            const detailPanel = await (await tabset.getActiveTabContent(Tab2)).getDetailPanel();
            return await detailPanel.getBaseRecordForm();
        }

        await gotoRecordHomeByUrl(RecordType.Contact, testEnvironment.contactId);
        const baseRecordForm = await gotToRecordDetailsTab();
        let recordLayout = await baseRecordForm.getRecordLayout();

        console.log('Access Name field on Details panel');
        let nameItem = await recordLayout.getItem(1, 2, 1);
        console.log('Remember value of the name field');
        let formattedName = await nameItem.getFormattedName();
        const nameString = await formattedName.getInnerText();

        console.log('Click inline edit (pencil) next to the Name field');
        const inlineEditButton = await nameItem.getInlineEditButton();
        await inlineEditButton.click();

        console.log('Click Save at the bottom of Details panel');
        const footer = await baseRecordForm.getFooter();
        const actionsRibbon = await footer.getActionsRibbon();
        const actionRenderer = await actionsRibbon.getActionRendererWithTitle('Save');
        const headlessAction = await actionRenderer.getHeadlessAction();
        const button = await headlessAction.getLightningButton();
        await button.click();

        console.log('Wait for page to reload');
        await button.waitForAbsence();

        const reloaded = await gotToRecordDetailsTab();
        recordLayout = await reloaded.getRecordLayout();
        nameItem = await recordLayout.getItem(1, 2, 1);

        console.log('Wait for field to be updated');
        await nameItem.waitForOutputField();
        formattedName = await nameItem.getFormattedName();
        expect(await formattedName.getInnerText()).toBe(nameString);
    });
});
