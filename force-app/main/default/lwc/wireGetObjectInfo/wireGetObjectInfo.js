/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { LightningElement, wire } from 'lwc';

export default class WireGetObjectInfo extends LightningElement {
    objectApiName;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo;

    handleBtnClick() {
        this.objectApiName = this.template.querySelector('lightning-input').value;
    }

    get objectInfoStr() {
        return this.objectInfo ? JSON.stringify(this.objectInfo.data, null, 2) : '';
    }
}
