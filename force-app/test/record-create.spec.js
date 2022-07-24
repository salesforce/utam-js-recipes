/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/record-create.spec.js

import RecordHomeFlexipage2 from 'salesforce-pageobjects/global/pageObjects/recordHomeFlexipage2';
import { RecordType } from './utilities/record-type';
import { login, openRecordModal } from './utilities/salesforce-test';
import { TestEnvironment } from './utilities/test-environment';
import RecordActionWrapper from 'salesforce-pageobjects/global/pageObjects/recordActionWrapper';

// TODO: replace with prefix of the environment from .env file
const TEST_ENVIRONMENT_PREFIX = 'na45';

describe('Record creation tests', () => {
    const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);
    const baseUrl = testEnvironment.redirectUrl;

    beforeAll(async () => {
        await login(testEnvironment, 'home');
    });

    it('Create a new Account Record', async () => {
        // TODO - depending on org setup, modal might not present, then comment next lines
        console.log('Load Change Record Type Modal');
        let recordFormModal = await openRecordModal(baseUrl, RecordType.Account);

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
        console.log('Load Record Form Modal');
        const recordFormModal = await openRecordModal(baseUrl, RecordType.Opportunity);
        const recordForm = await recordFormModal.getRecordForm();
        const recordLayout = await recordForm.getRecordLayout();

        console.log("Enter 'Close date' as 01/01/2020");
        const closeDateItem = await recordLayout.getItem(1, 1, 2);
        const datePicker = await closeDateItem.getDatepicker();
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
