# UTAM JavaScript Recipes

This repository contains examples of how to test the Salesforce UI using the [UTAM][utam-doc] framework.

> Note: This repository uses UTAM JavaScript. If you want to use UTAM with Java, visit the [UTAM Java recipes repository][utam-java-recipes].

__IMPORTANT: This repository's page objects and UI tests are compatible with the Salesforce Spring'23 release.__

> Note: These recipes are designed to work with a generic Salesforce org. If your org has customizations, you might need to modify page objects or tests locally to avoid errors.

## Project structure

This repository contains two npm packages. Both packages demonstrate how to set up page object authoring and compilation.

### 1) utam-js-recipes package (project root)

This package contains:

- Custom components that can be deployed to a scratch org
- Page objects associated with those custom components
- UI tests
- Scripts that ease the initial setup

Here's an outline of the directory structure and few of the important configuration files.

```txt
├── force-app // contains JSON page objects and tests
├── pageObjects (created after build)
├── package.json
├── utam.config.js
└── wdio.conf.js
```

The repo has a [hello](https://github.com/salesforce/utam-recipes-sfdx/tree/main/force-app/main/default/lwc/hello) Lightning web component. The JSON page object is in a `__utam__` folder beside the component source.

```txt
├── lwc
    ├── hello
         ├── hello.html
         ├── hello.js
         ├── hello.js-meta.xml
         └── __utam__
             └── hello.utam.json
```

### 2) utam-preview package

This package contains the page objects used in the UI tests that interact with the Salesforce UI. 

Both packages demonstrate how to setup page objects authoring and compilation.

## Requirements

- [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)
- [Node](https://nodejs.org/) >= 14.15.4
- [Yarn](https://yarnpkg.com/) >= 1.22.5

## Initial setup

### 1) Clone the repository

Clone the `utam-js-recipes` repository:

```sh
$ git clone git@github.com:salesforce/utam-js-recipes.git
$ cd utam-js-recipes
```

### 2) Install dependencies

```sh
$ yarn install
```

### 3) Build the project

Execute `yarn build` to generate page objects:

```sh
$ yarn build
```

There are two types of tests in this project:

1. The first test (`force-app/test/crud.spec.js`) loads a provided URL and logs in through the standard login page before beginning the test.
2. The other test (`force-app/test/sfdx-scratch-org.spec.js`) runs against the custom app and components in this project by loading the app in a scratch org.

Both tests demonstrate how UTAM can be used to author and compile page objects, and how to integrate the UTAM runtime with WebdriverIO.

## Dependency for Salesforce page objects

The `package.json` file contains a dependency for the `salesforce-pageobjects` package, which contains page objects from Salesforce. The package is available on [npm](https://www.npmjs.com/package/salesforce-pageobjects).

## Set up Salesforce Web UI tests

### 1) Create a .env file

We use a `.env` file to contain the URL and authentication credentials for test environments that we use.

> Note: don't commit your `.env` files. Those files contain sensitive credentials. The repository is set up so that we don't track those files by default.

Create a `.env` file by executing:

```sh
$ yarn create:env
```

This script creates a `.env` file located at the project root.

### 2) Configure your test environment variables

Open the `.env` file created during the previous step and configure your test environment credentials.

Here's a `.env` file that references a `SANDBOX` test environment. Each variable for the test environment starts with the test environment name followed by an underscore.

```shell-script
# Required variables
SANDBOX_URL=https://sandbox.salesforce.com/
SANDBOX_USERNAME=your.username@salesforce.com
SANDBOX_PASSWORD=strongPassword

# Optional variables
# sometimes after login URL changes
SANDBOX_REDIRECT_URL=https://lightningapp.lightning.test1234.salesforce.com/

# Used in force-app/test/record-update.spec.js
SANDBOX_ACCOUNT_ID=accountId
SANDBOX_CONTACT_ID=contactId
```

Replace SANDBOX with your test environment name.

A test references a test environment name in a call to the `TestEnvironment` constructor. For example:

```java
const TEST_ENVIRONMENT_PREFIX = 'sandbox';
const testEnvironment = new TestEnvironment(TEST_ENVIRONMENT_PREFIX);
```

The environment name must be all uppercase in the `.env` file but the name is case insensitive in the JavaScript code. The environment name of `sandbox` in the test code matches the uppercase `SANDBOX` name in the `.env` file. A camel case environment name of `sandboxOrg` in the test code would match an uppercase `SANDBOX_ORG` name in the `.env` file.

> Note: Add as many test environments as needed in your `.env` file. Just duplicate the variables and adjust the prefix and the values.

Alternatively, if you don't want to configure a `.env` file, you can prefix the test command with environment variables:

```sh
$ SANDBOX_URL=my-sandbox.com SANDBOX_USERNAME=user@salesforce.com SANDBOX_PASSWORD=password yarn test --spec force-app/test/record-*.spec.js
```

### 3) Update the Web UI tests

Open the Web UI test files located in:

- `force-app/test/record-create.spec.js`
- `force-app/test/record-update.spec.js`

For each test file, update the value of the `TEST_ENVIRONMENT_PREFIX` global variable located after the import statements:

```js
// Assuming your test environment is sandbox (must match the prefix used in the .env file)
const TEST_ENVIRONMENT_PREFIX = 'sandbox';
```

For the `force-app/test/record-update.spec.js` file, update your `.env` file with the account and contact IDs of your test environment. That's how it looks like for an environment named `sandbox`:

```
SANDBOX_ACCOUNT_ID=XXXXXXXXXXXXXXXXXX
SANDBOX_CONTACT_ID=XXXXXXXXXXXXXXXXXX
````

## Setup SFDX scratch org test

### Prerequisites

Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

- Enable Dev Hub in your Trailhead Playground
- Install Salesforce CLI
- (Optional) Install Visual Studio Code
- (Optional) Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

### Org Setup

1. If you haven't already done so, authorize your hub org and provide it with an alias (**myhuborg** in the command below). Use the login credentials generated from your Trailhead Playground in the Prerequisites section above or your own Developer Edition org if you prefer:

    ```sh
    $ sfdx auth:web:login -d -a myhuborg
    ```

2. Create a scratch org and provide it with an alias (**utam-js-recipes** in the command below):

    ```sh
    $ sfdx force:org:create -s -f config/project-scratch-def.json -a utam-js-recipes
    ```

> Note: If this step throws an error `ERROR running force:org:create:  You do not have access to the [ScratchOrgInfo] object`, you must [**enable Dev Hub**][enable-dev-hub].
> To enable **Dev Hub**:
    1. Log in to the org you authenticated against during step 1 in a web browser.
    2. Click on the Setup icon in the upper right corner.
    3. Click Setup.
    4. Search for `dev hub` using the quick find search box on the left pane.
    5. Click on the `Dev Hub` item under `Development`.
    6. Click on the `Enable Dev Hub` toggle.
    7. Create a scratch org using the `sfdx force:org:create` command mentioned previously

3. Push the app to your scratch org:

    ```sh
    $ sfdx force:source:push
    ```

4. Assign the **utam** permission set to the default user:

    ```sh
    $ sfdx force:user:permset:assign -n utam
    ```

> Note: if this step throws an error `Permission set not found in target org`, run `sfdx plugins:install user` and repeat from step 3

5. Open the scratch org:

    ```sh
    $ sfdx force:org:open
    ```

If you need to recreate a scratch org:

- find created org `sfdx force:org:list --all`
- delete previously created org with `sfdx force:org:delete`. It will prompt you to delete the org from the list, or specify an org alias or email `sfdx force:org:delete -u utam-js-recipes`
- recreate scratch orgs (repeat steps starting from step 3)

## Running UI tests

Execute all tests at once by running:

```sh
$ yarn test
```

This command runs all UI tests in the repository, namely all tests in `force-app/test/crud.spec.js` and `force-app/test/sfdx-scratch-org.spec.js`.

### Run the Web UI test

These tests require login credentials to an existing org. Make sure that your test environment is set up as described in [Set up Salesforce Web UI tests](#set-up-salesforce-web-ui-tests).

Run the Web UI tests against the environment you configured:

```sh
$ yarn test --spec force-app/test/record-create.spec.js
$ yarn test --spec force-app/test/record-update.spec.js
```

To run all tests related to records, run:

```sh
$ yarn test --spec force-app/test/record-*.spec.js
```

> Note: CRUD tests will modify real records in the org so only sandbox or development-specific orgs should be used.

### Run the local app in a scratch org test

These tests run under the assumption that the initial URL loaded contains an access token so no manual login is required.
To generate such a URL, follow the Org Setup steps above and then run:

```sh
$ yarn generate:login
```

This command runs the `sfdx` command below and adds the generated URL to the `.env` file in the root of this project.

```sh
$ sfdx force:org:open -p /lightning -r
```

Finally, run tests:

```sh
$ yarn test --spec force-app/test/sfdx-scratch-org.spec.js
```

### Run the test against the UTAM doc site

The repository contains a [test against utam.dev](https://github.com/salesforce/utam-js-recipes/blob/main/force-app/test/utam-portal.spec.js).
The test doesn't require any special setup. The instructions to run it are inside the test.

[enable-dev-hub]: https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_setup_enable_devhub.htm
[utam-js]: https://www.github.com/salesforce/utam-js
[utam-doc]: https://utam.dev
[utam-java-recipes]: https://www.github.com/salesforce/utam-java-recipes

## Run Salesforce Mobile test

- There are two sample tests under `force-app/test/mobile`: `navigation.spec.js` is against Community playground application and `login.spec.js` is against Salelsforce application.
- Follow the instructions at [Get Started for Mobile](https://utam.dev/guide/get_started_utam#get-started-for-mobile) to set up your local simulator/emulator.
- Make sure that [Appium](https://github.com/appium/appium#readme) and [node.js](https://nodejs.org/en/) are installed on your machine.
- Update the wdio configuration file:
For an iOS test, update `wdio.conf.xx.ios.js` ((wdio.conf.sapp.ios.js is for test against Salesforce App, and wdio.conf.mpcc.ios.js is for test against Community Playground App) file to configure the test device name(appium:deviceName), iOS version(appium:platformVersion), and the full path for the test application(appium:app):

```js
'appium:deviceName': 'iPhone 12',
'appium:app': '<path to iOS test app>',
'appium:platformVersion': '15.2',
```

For an Android test, update the `wdio.conf.xx.android.js` (wdio.conf.sapp.android.js is for test against Salesforce App, and wdio.conf.mpcc.android.js is for test against Community Playground App) file to configure the test device name(appium:deviceName) and the full path for the test application(appium:app):

```js
'appium:deviceName': 'emulator-5554',
'appium:app': '<path to Android test app>',
```

- Download the [Salesforce application Build](https://developer.salesforce.com/tools/mobile-debugging) and [Community playground application build](https://help.salesforce.com/s/articleView?id=sf.s1_branded_apps_playground_preview_exp_site.htm&type=5) for the Salesforce iOS and Android mobile application debug builds.
- Commands to execute a test: 
For iOS: yarn test wdio.conf.xx.ios.js (wdio.conf.sapp.ios.js is for test against Salesforce App, and wdio.conf.mpcc.ios.js is for test against Community Playground App)
For Android: yarn test wdio.conf.xx.android.js (wdio.conf.sapp.android.js is for test against Salesforce App, and wdio.conf.mpcc.android.js is for test against Community Playground App)
- For a test on Android, make sure to start an emulator before the test run. Otherwise, you will get an error like this: "Error: Failed to create session.
An unknown server-side error occurred while processing the command. Original error: Could not find a connected Android device in 20190ms.".
- Install the appropriate version of chromedriver based on the instructions on this [site](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/web/chromedriver.md).