/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/record-update.spec.js

import RecordActionWrapper from 'utam-preview/pageObjects/recordActionWrapper';
import RecordHomeFlexipage2 from 'utam-preview/pageObjects/recordHomeFlexipage2';
import FormattedName from 'utam-preview/pageObjects/formattedName';
import Tab2 from 'utam-preview/pageObjects/tab2';
import { RecordType } from './utilities/record-type';
import { login } from './utilities/salesforce-test';
import { TestEnvironment } from './utilities/test-environment';

// TODO: replace with prefix of the environment from .env file
const TEST_ENVIRONMENT_PREFIX = 'na45';
// TODO: replace with existing Account Id for the environment
const ACCOUNT_RECORD_ID = '001S7000002X6FSIA0';
// TODO: replace with existing Contact Id for the environment
const CONTACT_RECORD_ID = '003S7000001vfDXIAY';

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

    const equalsIgnoreCase = (str1, str2) => str1.toLowerCase() === str2.toLowerCase();

    beforeAll(async () => {
        await login(testEnvironment, 'home');
    });

    // it('Update an existing Account Record', async () => {
    //     await gotoRecordHomeByUrl(RecordType.Account, ACCOUNT_RECORD_ID);

    //     console.log('Load Accounts Record Home page');
    //     const recordHome = await utam.load(RecordHomeFlexipage2);

    //     console.log('Access Record Highlights panel');
    //     const highlightsPanel = await recordHome.getAccountHighlights();

    //     console.log("Wait for button 'Edit' and click on it");
    //     const actionsRibbon = await highlightsPanel.getActions();
    //     const editButton = await actionsRibbon.waitForRenderedAction('Edit');
    //     await editButton.clickButton();

    //     console.log('Load Record Form Modal');
    //     const recordFormModal = await utam.load(RecordActionWrapper);
    //     const recordForm = await recordFormModal.getRecordForm();
    //     const recordLayout = await recordForm.getRecordLayout();

    //     console.log('Access record form item by index');
    //     const item = await recordLayout.getItem(1, 2, 1);

    //     console.log('Enter updated account name');
    //     const accountName = 'Utam';
    //     const input = await item.getTextInput();
    //     await input.setText(accountName);

    //     console.log('Save updated record');
    //     await recordForm.clickFooterButton('Save');
    //     await recordFormModal.waitForAbsence();
    // });

    it('Update an existing Contact Record', async () => {
        const detailsTabLabel = 'Details';
        await gotoRecordHomeByUrl(RecordType.Contact, CONTACT_RECORD_ID);

        console.log('Load Accounts Record Home page');
        const recordHome = await utam.load(RecordHomeFlexipage2);

        console.log('Select "Details" tab');
        const tabset = await recordHome.getContactTabset();
        const tabBar = await tabset.getTabBar();
        const activeTabName = await tabBar.getActiveTabText();
        if (!equalsIgnoreCase(activeTabName, detailsTabLabel)) {
            await tabBar.clickTab(detailsTabLabel);
        }

        console.log('Access Name field on Details panel');
        const detailPanel = await (await tabset.getActiveTabContent(Tab2)).getDetailPanel();
        const baseRecordForm = await detailPanel.getBaseRecordForm();
        const recordLayout = await baseRecordForm.getRecordLayout();
        const nameItem = await recordLayout.getItem(1, 2, 1);

        console.log('Remember value of the name field');
        const formattedName = await nameItem.getOutputField(FormattedName);
        const nameString = await formattedName.getInnerText();
        console.log(nameString);

        console.log('Click inline edit (pencil) next to the Name field');
        const inlineEditButton = await nameItem.getInlineEditButton();
        await inlineEditButton.click();

        console.log('Click Save at the bottom of Details panel');
        const footer = await baseRecordForm.getFooter();
        const actionsRibbon = await footer.getActionsRibbon();
        const actionRenderer = await actionsRibbon.waitForRenderedAction('Save');
        const headlessAction = await actionRenderer.getHeadlessAction();
        const button = await headlessAction.getLightningButton();
        await button.click();

        console.log('Wait for field to be updated');
        await nameItem.waitForOutputField();

        // console.log('Check that field value has not changed');
        // expect(await formattedName.getInnerText()).toStrictEqual(nameString);
    });
});
