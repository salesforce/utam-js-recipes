/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/record-create.spec.js

import ConsoleObjectHome from 'utam-preview/pageObjects/consoleObjectHome';
import RecordActionWrapper from 'utam-preview/pageObjects/recordActionWrapper';
import RecordHomeFlexipage2 from 'utam-preview/pageObjects/recordHomeFlexipage2';
import { RecordType } from './utilities/record-type';
import { login } from './utilities/salesforce-test';
import { TestEnvironment } from './utilities/test-environment';

// TODO: replace with prefix of the environment from .env file
const TEST_ENVIRONMENT_PREFIX = 'na45';

/**
 * Utility function that open a given record type modal
 * @param {string} baseUrl test environment
 * @param {RecordType} recordType type of record used in the UI test
 * @returns {Promise<void>} instance of the record modal Page Object
 */
async function openRecordModal(baseUrl, recordType) {
    console.log(`Navigate to an Object Home for ${recordType.name}`);
    await browser.navigateTo(recordType.getObjectHomeUrl(baseUrl));

    console.log(`Load ${recordType.name} Object Home page`);
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

describe('Record creation tests', () => {
    const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);
    const baseUrl = testEnvironment.redirectUrl;

    beforeAll(async () => {
        await login(testEnvironment, 'home');
    });

    it('Create a new Account Record', async () => {
        await openRecordModal(baseUrl, RecordType.Account);

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

    it('Create a new Opportunity Record', async () => {
        await openRecordModal(baseUrl, RecordType.Opportunity);

        console.log('Load Record Form Modal');
        const recordFormModal = await utam.load(RecordActionWrapper);
        const recordForm = await recordFormModal.getRecordForm();
        const recordLayout = await recordForm.getRecordLayout();

        console.log("Enter 'Close date' as 01/01/2020");
        const item = await recordLayout.getItem(1, 1, 2);
        const datePicker = await item.getDatepicker();
        await datePicker.setDateText('01/01/2020');

        console.log("Pick first option in a 'Stage' combobox");
        const stageItem = await recordLayout.getItem(1, 2, 2);
        const stageCombobox = await (await stageItem.getStageNamePicklist()).getBaseCombobox();
        await stageCombobox.expandForDisabledInput();
        await stageCombobox.pickItem(2);

        console.log('Find and pick first account, link it to the opportunity');
        const accountLookupItem = await recordLayout.getItem(1, 3, 1);
        const accountLookup = await (await accountLookupItem.getLookup()).getBaseCombobox();
        await accountLookup.expand();
        await accountLookup.pickItem(1);

        console.log('Enter opportunity name');
        const nameItem = await recordLayout.getItem(1, 2, 1);
        const nameInput = await nameItem.getTextInput();
        await nameInput.setText('Opportunity name');

        console.log('Save new record');
        await recordForm.clickFooterButton('Save');
        await recordFormModal.waitForAbsence();

        console.log('Load Record Home page');
        await utam.load(RecordHomeFlexipage2);
    });
});
