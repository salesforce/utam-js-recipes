/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

// to run:
// yarn test --spec force-app/test/record-all-items.spec.js

import { RecordType } from './utilities/record-type';
import { login, openRecordModal } from './utilities/salesforce-test';
import { TestEnvironment } from './utilities/test-environment';

// TODO: replace with prefix of the environment from .env file
const TEST_ENVIRONMENT_PREFIX = 'na44';

describe('Test LwcRecordLayout methods', () => {
    const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);
    const baseUrl = testEnvironment.redirectUrl;

    it('Test LwcRecordLayout.getSections() waits for sections', async () => {
        await login(testEnvironment, 'home');
        const recordFormModal = await openRecordModal(baseUrl, RecordType.Opportunity);
        const recordForm = await recordFormModal.getRecordForm();
        const recordLayout = await recordForm.getRecordLayout();

        // test sections count
        const sections = await recordLayout.getSections();
        const sectionsCount = sections.length;
        console.log('Number of sections: ' + sectionsCount);
        expect(sectionsCount).toBeGreaterThan(0);

        // test items count
        const items = await recordLayout.getAllItems();
        const itemsCount = items.length;
        console.log('Number of items: ' + itemsCount);
        expect(itemsCount).toBeGreaterThan(0);
    });
});
