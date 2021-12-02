/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/crud.spec.js

import ConsoleObjectHome from 'utam-preview/pageObjects/consoleObjectHome';
import RecordActionWrapper from 'utam-preview/pageObjects/recordActionWrapper';
import RecordHomeFlexipage2 from 'utam-preview/pageObjects/recordHomeFlexipage2';
import { RecordType } from './utilities/record-type';
import { login } from './utilities/salesforce-test';
import { TestEnvironment } from './utilities/test-environment';

const TEST_ENVIRONMENT_PREFIX = 'na45';

describe('Account Record CRUD recipe', () => {
    const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);

    /**
     * Utility function that open a given record type modal
     * @param {RecordType} recordType type of record used in the UI test
     */
    async function openRecordModal(recordType) {
        console.log(`Navigate to an Object Home for ${recordType.name}`);
        await browser.navigateTo(recordType.getObjectHomeUrl(testEnvironment.redirectUrl));

        console.log('Load Accounts Object Home page');
        const objectHome = await utam.load(ConsoleObjectHome);
        const listView = await objectHome.getListView();
        const listViewHeader = await listView.getHeader();

        console.log("List view header: click button 'New'");
        const actionLink = await listViewHeader.waitForAction('New');
        await actionLink.click();

        console.log('Load Record Form Modal');
        const recordFormModal = await utam.load(RecordActionWrapper);
        const isRecordFormModalPresent = await recordFormModal.isPresent();
        expect(isRecordFormModalPresent).toBe(true);
    }

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

    beforeEach(async () => {
        await login(testEnvironment, 'home');
    });

    it('Create a new Account Record', async () => {
        await openRecordModal(RecordType.Account);

        // TODO - depending on org setup, modal might not present, then comment next lines
        console.log('Load Change Record Type Modal');
        let recordFormModal = await utam.load(RecordActionWrapper);

        console.log("Change Record Type Modal: click button 'Next'");
        const changeRecordTypeFooter = await recordFormModal.waitForChangeRecordFooter();
        await changeRecordTypeFooter.clickButton('Next');

        console.log('Load Record Form Modal');
        recordFormModal = await utam.load(RecordActionWrapper);
        const recordForm = await recordFormModal.getRecordForm();
        const recordLayout = await recordForm.getRecordLayout();

        console.log('Access record form item by index');
        const item = await recordLayout.getItem(1, 2, 1);

        console.log('Enter account name');
        const accountName = 'Utam';
        const input = await item.getTextInput();
        await input.setText(accountName);

        console.log('Save new record');
        await recordForm.clickFooterButton('Save');
        await recordFormModal.waitForAbsence();

        console.log('Load Accounts Record Home page');
        await utam.load(RecordHomeFlexipage2);
    });

    it('Update an existing Account Record', async () => {
        // TODO: replace with existing Account Id for the environment
        const accountRecordId = '001S7000001pSmBIAU';
        await gotoRecordHomeByUrl(RecordType.Account, accountRecordId);

        console.log('Load Accounts Record Home page"');
        const recordHome = await utam.load(RecordHomeFlexipage2);

        console.log('Access Record Highlights panel');
        const highlightsPanel = await recordHome.getAccountHighlights();

        console.log("Wait for button 'Edit' and click on it");
        const actionsRibbon = await highlightsPanel.getActions();
        const editButton = await actionsRibbon.waitForRenderedAction('Edit');
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
});
