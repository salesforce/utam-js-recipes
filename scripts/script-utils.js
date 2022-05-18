/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { join } = require('path');
const { parse } = require('envfile');

const SCRATCH_ORG_KEY = 'SCRATCH_ORG_LOGIN_URL';
const SCRATCH_ORG_TIMESTAMP = 'SCRATCH_ORG_LOGIN_TIMESTAMP';

const DOTENV_FILEPATH = join(__dirname, '../.env');

const ENV_REGEX = /^([a-z0-9_\-]*)=(.*)$/gim;

/**
 * Replaces the value of a target key in a property file.
 * Creates the key if it does not exist.
 *
 * @param {string} envFile content of the existing property file
 * @param {string} targetKey target key for update
 * @param {string} newValue new value for target key
 * @returns the content of the updated property file
 */
function upsertKeyValue(envFile, targetKey, newValue) {
    const parsedEnv = parse(envFile);
    if (parsedEnv.hasOwnProperty(targetKey)) {
        // Replace key value
        return envFile.replace(ENV_REGEX, (match, key, value) => {
            return key === targetKey ? `${key}=${newValue}` : `${key}=${value}`;
        });
    } else {
        // Append key to file
        return `${envFile}\n${targetKey}=${newValue}`;
    }
}

/**
 * Generate default content for a property file that can be use to login in the scratch org
 *
 * @param {string} url scratch org login url to set in the property file
 * @param {number} timestamp scratch org login timestamp to set in the property file
 * @returns {string} the content of the property file to write to disk
 */
function getDefaultTemplate(url = '', timestamp = null) {
    return `# DO NOT CHECK THIS FILE IN WITH PERSONAL INFORMATION SAVED
#
# Environment variables required to run tests. Values here will be populated by
# running "node scripts/generate-login-url.js"
#
# Example:
# SCRATCH_ORG_LOGIN_URL=https://<scratch-org-name>.cs22.my.salesforce.com/secur/frontdoor.jsp?sid=<generated-sid>

SCRATCH_ORG_LOGIN_URL=${url}
SCRATCH_ORG_LOGIN_TIMESTAMP=${timestamp}`;
}

module.exports = {
    SCRATCH_ORG_KEY,
    SCRATCH_ORG_TIMESTAMP,
    DOTENV_FILEPATH,
    upsertKeyValue,
    getDefaultTemplate,
};
