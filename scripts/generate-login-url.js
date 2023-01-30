/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { existsSync, readFileSync, writeFileSync } = require('fs');
const {
    upsertKeyValue,
    getDefaultTemplate,
    DOTENV_FILEPATH,
    SCRATCH_ORG_KEY,
    SCRATCH_ORG_TIMESTAMP,
} = require('./script-utils');

/**
 * Updates an existing property file and returns its content
 *
 * @param {string} filePath path the default property file
 * @param {string} url scratch org login url to set in the property file
 * @param {number} timestamp scratch org login timestamp to set in the property file
 * @returns {string} the property file with the updated url
 */
function getUpdatedEnvFile(filePath, url, timestamp) {
    let envFile = readFileSync(filePath, { encoding: 'utf-8' });
    envFile = upsertKeyValue(envFile, SCRATCH_ORG_KEY, url);
    envFile = upsertKeyValue(envFile, SCRATCH_ORG_TIMESTAMP, timestamp);
    return envFile;
}

/**
 * Get the scratch org login url from a child CLI process and parse it
 * @returns {Promise<string>} the scratch org url fetched from the getUrlCmd
 */
async function getScratchOrgLoginUrl() {
    const getUrlCmd = 'sfdx force:org:open -p /lightning -r --json';
    console.log('Executing the following command: ', getUrlCmd);
    const { stderr, stdout } = await exec(getUrlCmd, { cwd: __dirname });
    if (stderr) throw new Error(stderr);
    const response = JSON.parse(stdout);
    const { url } = response.result;
    console.log(`Command returned with response: ${url}`);
    return url;
}

/**
 * Main script entry point - generate a property file with the correct scratch org login url:
 *
 * 1. get the scratch org login url
 * 2. create or update the property file with the url returned in step 1
 */
async function generateLoginUrl() {
    try {
        const url = await getScratchOrgLoginUrl();
        const timestamp = new Date().getTime();
        const envFile = existsSync(DOTENV_FILEPATH)
            ? getUpdatedEnvFile(DOTENV_FILEPATH, url, timestamp)
            : getDefaultTemplate(url, timestamp);
        writeFileSync(DOTENV_FILEPATH, envFile);
        console.log(`Property .env file successfully generated in ${DOTENV_FILEPATH}`);
    } catch (err) {
        console.log(err);
    }
}

generateLoginUrl();
