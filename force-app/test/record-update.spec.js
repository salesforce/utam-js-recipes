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
import { RecordType } from './utilities/record-type';
import { login } from './utilities/salesforce-test';
import { TestEnvironment } from './utilities/test-environment';

// TODO: replace with prefix of the environment from .env file
const TEST_ENVIRONMENT_PREFIX = 'na45';
// TODO: replace with existing Account Id for the environment
const ACCOUNT_RECORD_ID = '001S7000002aqamIAA';

/**
 * Utility function that returns a given record URL
 * @param {string} baseUrl test environment
 * @param {RecordType} recordType type of record used in the UI test
 * @param {string} recordId id of the record for which we are getting the URL
 */
async function gotoRecordHomeByUrl(baseUrl, recordType, recordId) {
    const recordHomeUrl = recordType.getRecordHomeUrl(baseUrl, recordId);
    console.log(`Navigate to the Record Home by URL: ${recordHomeUrl}`);
    await browser.navigateTo(recordHomeUrl);
}

describe('Record update test', () => {
    const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);

    beforeAll(async () => {
        await login(testEnvironment, 'home');
    });

    it('Update an existing Account Record', async () => {
        await gotoRecordHomeByUrl(testEnvironment.redirectUrl, RecordType.Account, ACCOUNT_RECORD_ID);

        console.log('Load Accounts Record Home page');
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
