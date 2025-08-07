/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/record-create.spec.js

import RecordHomeFlexipage2 from 'salesforce-pageobjects/global/pageObjects/recordHomeFlexipage2';
import { RecordType } from './utilities/record-type.js';
import { login, openRecordModal } from './utilities/salesforce-test.js';
import { TestEnvironment } from './utilities/test-environment.js';
import RecordActionWrapper from 'salesforce-pageobjects/global/pageObjects/recordActionWrapper';
import InputStageName from 'salesforce-pageobjects/sfa/pageObjects/inputStageName';

// TODO: replace with prefix of the environment from .env file
const TEST_ENVIRONMENT_PREFIX = 'na44';

describe('Record creation tests', () => {
    const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);
    const baseUrl = testEnvironment.redirectUrl;

    beforeAll(async () => {
        await login(testEnvironment, 'home');
    });

    it('Create a new Account Record', async () => {
        let recordFormModal = await openRecordModal(baseUrl, RecordType.Account);
        // TODO - depending on org setup, modal might not present, then comment next lines
        /* 
        console.log('Load Change Record Type Modal');
        recordFormModal = await utam.load(RecordActionWrapper);
        console.log("Change Record Type Modal: click button 'Next'");
        const changeRecordTypeFooter = await recordFormModal.waitForChangeRecordFooter();
        await changeRecordTypeFooter.clickButton('Next');
        */

        console.log('Load Record Form Modal');
        recordFormModal = await utam.load(RecordActionWrapper);
        const recordForm = await recordFormModal.getRecordForm();
        const recordLayout = await recordForm.getRecordLayout();

        console.log('Access record form item by index');
        const section = await recordLayout.getSection(1);
        const row = await section.getRow(2);
        const item = await row.getItem(1);

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
        console.log('Load Record Form Modal');
        const recordFormModal = await openRecordModal(baseUrl, RecordType.Opportunity);
        const recordForm = await recordFormModal.getRecordForm();
        const recordLayout = await recordForm.getRecordLayout();

        console.log("Enter 'Close date' as 01/01/2020");
        const section = await recordLayout.getSection(1);
        const dateRow = await section.getRow(2);
        const closeDateItem = await dateRow.getItem(2);
        const datePicker = await closeDateItem.getDatepicker();
        await datePicker.setDateText('01/01/2020');

        console.log("Pick first option in a 'Stage' combobox");
        const stageRow = await section.getRow(4);
        const stageItem = await stageRow.getItem(2);
        const inputStageNameField = await stageItem.getInputField(InputStageName);
        const stagePicklist = await inputStageNameField.getRecordPicklist();
        const basePicklist = await stagePicklist.getBasePicklist();
        const stageCombobox = await basePicklist.getBaseCombobox();
        await utam.waitFor(
            async () => {
                await stageCombobox?.expandForDisabledInput();
                await stageCombobox?.pickItem(2);
                return true;
            },
            { message: 'cant pick opportunity name' },
        );

        console.log('Find and pick first account, link it to the opportunity');
        const accountLookupSection = await recordLayout.getSection(1);
        const accountLookupRow = await accountLookupSection.getRow(4);
        const accountLookupItem = await accountLookupRow.getItem(1);
        const accountLookup = await (await accountLookupItem.getLookup()).getBaseCombobox();
        await accountLookup.expand();
        await accountLookup.pickItem(1);

        console.log('Enter opportunity name');
        const nameSection = await recordLayout.getSection(1);
        const nameRow = await nameSection.getRow(3);
        const nameItem = await nameRow.getItem(1);
        const nameInput = await nameItem.getTextInput();
        await nameInput.setText('Opportunity name');

        console.log('Save new record');
        await recordForm.clickFooterButton('Save');
        await recordFormModal.waitForAbsence();

        console.log('Load Record Home page');
        await utam.load(RecordHomeFlexipage2);
    });
});
