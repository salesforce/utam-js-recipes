/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { reduceErrors } from 'c/ldsUtils';
import { api, LightningElement } from 'lwc';
import inlineMessage from './templates/inlineMessage.html';
import noDataIllustration from './templates/noDataIllustration.html';

export default class ErrorPanel extends LightningElement {
    /** Single or array of LDS errors */
    @api errors;
    /** Generic / user-friendly message */
    @api friendlyMessage = 'Error retrieving data';
    /** Type of error message **/
    @api type;

    viewDetails = false;

    get errorMessages() {
        return reduceErrors(this.errors);
    }

    handleShowDetailsClick() {
        this.viewDetails = !this.viewDetails;
    }

    render() {
        if (this.type === 'inlineMessage') return inlineMessage;
        return noDataIllustration;
    }
}
