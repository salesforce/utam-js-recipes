# UTAM JavaScript Recipes

[UTAM JS][utam-js] UI tests examples in a typical Salesforce DX workspace. 

This repository demonstrates how to test the Salesforce UI using the [UTAM][utam-doc] framework using canonical examples.

> Note: this repository uses UTAM JS, if you are looking to use UTAM with Java, visit the [UTAM Java recipes repository][utam-java-recipes].

__IMPORTANT: Repository's page objects and UI tests are compatible with Salesforce Spring'22 release__

## Project structure

This repository contains 2 npm packages:

1. `utam-js-recipes` (project root)
2. `utam-preview`

### 1) utam-js-recipes package

This package contains:

- The custom components that can be deployed to a scratch org
- The page objects associated with those custom components
- The UI tests
- Some scripts that ease the inital setup

### 2) utam-preview package

This package contains the Page Objects that are used in the UI tests to interact with the Salesforce UI.

Note that both packages demonstrate how to setup page objects authoring and compilation.

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

> Note: `yarn prepare` shows error if you run it more than once, it's normal because once yarn link is created it requires to unlink to run again.

There are two types of tests in this project:

1. The first test (`force-app/test/crud.spec.js`) loads a provided URL and logs in through the standard login page before beginning the test.
2. The other test (`force-app/test/sfdx-scratch-org.spec.js`) test the custom app and components in this project by loading the app in a scratch org.

Both test demonstrates how UTAM can be use to author and compile page objects, and how to integrate the UTAM runtime with WebdriverIO.

## Setup Salesforce Web UI tests

### 1) Create a .env file

Create a new dotenv file by executing:

```sh
$ yarn create:env
```

This script creates a dotenv file: `.env` located at the project root.

> Note: don't commit your .env files. Those files contains sensible credentials. The repository is setup so that we don't track those files by default.

### 2) Configure your test environment variables

Open the `.env` file created during the previous step and configure your test environment credentials as follow.

Assuming the name of the test environment is `sandbox`, edit the `.env` file so that the content as a similar structure:

```shell-script
# Required variables
SANDBOX_URL=https://sandbox.salesforce.com/
SANDBOX_USERNAME=your.username@salesforce.com
SANDBOX_PASSWORD=strongPassword

# Optional variables
# sometimes after login URL changes
SANDBOX_REDIRECT_URL=https://lightningapp.lightning.test1234.salesforce.com/
```

Replace SANDBOX with your test environment name.

> Note: you can add as many test environments as needed, just duplicate the variables and adjust the prefix and the values.

Alternatively, if you don't want to configure the dotenv file, you can also prefix the test command with environment variables:

```sh
$ SANDBOX_URL=my-sandbox.com SANDBOX_USERNAME=user@salesforce.com SANDBOX_PASSWORD=password yarn test --spec force-app/test/crud.spec.js
```

### 3) Update the Web UI test

Open the Web UI test file located in `force-app/test/crud.spec.js` and update the value of the `TEST_ENVIRONMENT_PREFIX`
global variable located after the import statements:

```js
// Assuming your test environment is sandbox (must match the prefix used in the dotenv file)
const TEST_ENVIRONMENT_PREFIX = 'sandbox';
```

## Setup SFDX scratch org test

### Prerequisites

Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

- Enable Dev Hub in your Trailhead Playground
- Install Salesforce CLI
- (Optional) Install Visual Studio Code
- (Optional) Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

### Org Setup

1. If you haven't already done so, authorize your hub org and provide it with an alias (**myhuborg** in the command below). Use the login credentials generated from your Trailhead Playground in the Prerequisites section above or your own DE org if you prefer:

    ```sh
    $ sfdx auth:web:login -d -a myhuborg
    ```

2. Clone the utam-js-recipes repository:

    ```sh
    $ git clone https://github.com/salesforce/utam-js-recipes.git
    $ cd utam-js-recipes
    ```

3. Create a scratch org and provide it with an alias (**utam-js-recipes** in the command below):

    ```sh
    $ sfdx force:org:create -s -f config/project-scratch-def.json -a utam-js-recipes
    ```
> Note: If this step throws an error `ERROR running force:org:create:  You do not have access to the [ScratchOrgInfo] object`, you must [**enable Dev Hub**][enable-dev-hub].
> To enable **Dev Hub**:

    1. Log in to the org you authenticated against during step 1 in a web browser.
    2. Click on the Setup icon on the upper right corner.
    3. Click Setup.
    4. Search for `dev hub` using the quick find search box on the left pane.
    5. Click on the `Dev Hub` item under `Development`.
    6. Click on the `Enable Dev Hub` toggle.
    7. Create a scratch org using the `sfdx force:org:create` command mentioned previously

4. Push the app to your scratch org:

    ```sh
    $ sfdx force:source:push
    ```

5. Assign the **utam** permission set to the default user:

    ```sh
    $ sfdx force:user:permset:assign -n utam
    ```
> Note: if this step throws an error `Permission set not found in target org`, run `sfdx plugins:install user` and repeat from step 3

6. Open the scratch org:

    ```sh
    $ sfdx force:org:open
    ```

If you need to recreate a scratch org:
- find created org `sfdx force:org:list --all`
- delete previously created org with `sfdx force:org:delete`, it will prompt you to delete first org from list, or specify org alias or email `sfdx force:org:delete -u utam-recipes`
- recreate scratch orgs (repeat steps starting from step 3)

## Running UI tests

Execute all tests at once by running:

```sh
$ yarn test
```

This command run all UI tests in the repository, namely all tests in `force-app/test/crud.spec.js` and `force-app/test/sfdx-scratch-org.spec.js`.

### Run the Web UI test

These tests require login credentials to an existing org, make sure your test environment is setup as described in [Setup Salesforce Web UI tests](#setup-salesforce-web-ui-tests).

Run the Web UI test against the environment you configured:

```sh
$ yarn test --spec force-app/test/crud.spec.js
```

> Note: that CRUD tests will modify real records in the org so only sandbox or development specific orgs should be used.

### Testing the local app in a scratch org

These tests run under the assumption that the initial URL loaded contains an access token so no manual login is required.
To generate such URL, follow the Org Setup steps above and then run:

```sh
$ yarn generate:login
```

which runs the below `sfdx` command and adds the generated URL to the `.env` file in the root of this project.

```sh
$ sfdx force:org:open -p /lightning -r
```

Finally, run tests with:

```sh
$ yarn test --spec force-app/test/sfdx-scratch-org.spec.js
```

[enable-dev-hub]: https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_setup_enable_devhub.htm
[utam-js]: https://www.github.com/salesforce/utam-js
[utam-doc]: https://utam.dev
[utam-java-recipes]: https://www.github.com/salesforce/utam-java-recipes