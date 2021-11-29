/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * Class that represents a RecordType 'enum' used for record UI tests
 */
export class RecordType {
    static Account = new RecordType('Account');
    static Lead = new RecordType('Lead');
    static Opportunity = new RecordType('Opportunity');

    /**
     * Create a record type
     * @param {'Account'|'Lead'|'Opportunity'} name record name as specified in the static properties
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Utility function that returns the object homepage URL
     * @param {string} baseUrl Test environment base URL read from environment file
     * @returns {string} the object home URL of a specific record type
     */
    getObjectHomeUrl(baseUrl) {
        return `${baseUrl}lightning/o/${this.name}/list?filterName=Recent`;
    }

    /**
     * Utility function that returns the record homepage URL
     * @param {string} redirectUrl Test environment redirection URL read from environment file
     * @param {string} recordId Id of the record
     * @returns {string} the record home URL of a specific record type
     */
    getRecordHomeUrl(redirectUrl, recordId) {
        return `${redirectUrl}lightning/r/${this.name}/${recordId}/view`;
    }
}
