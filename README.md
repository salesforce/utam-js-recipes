# utam-js-recipes

A UTAM example in a typical Salesforce DX workspace.

## Requirements

- Node >= 14.x.x
- Yarn >= 1.x.x

1. Clone the repository:

```bash
git clone https://github.com/salesforce/utam-js-recipes.git
cd utam-js-recipes
```

2. Install the dependencies:

```bash
yarn install
```

## Run Salesforce Web UI tests

To configure the test environment, create a

## Run SFDX scratch org test

### Prerequisites

Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

    - Enable Dev Hub in your Trailhead Playground
    - Install Salesforce CLI
    - (Optional) Install Visual Studio Code
    - (Optional) Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

### Org Setup

1. If you haven't already done so, authorize your hub org and provide it with an alias (**myhuborg** in the command below). Use the login credentials generated from your Trailhead Playground in the Prerequisites section above or your own DE org if you prefer:

    ```
    sfdx auth:web:login -d -a myhuborg
    ```

2. Clone the utam-js-recipes repository:

    ```
    git clone https://github.com/salesforce/utam-js-recipes.git
    cd utam-js-recipes
    ```

3. Create a scratch org and provide it with an alias (**utam-js-recipes** in the command below):

    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a utam-js-recipes
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

    ```
    sfdx force:source:push
    ```

5. Assign the **utam** permission set to the default user:

    ```
    sfdx force:user:permset:assign -n utam
    ```
> Note: if this step throws an error `Permission set not found in target org`, run `sfdx plugins:install user` and repeat from step 3

6. Open the scratch org:

    ```
    sfdx force:org:open
    ```

If you need to recreate a scratch org:
- find created org `sfdx force:org:list --all`
- delete previously created org with `sfdx force:org:delete`, it will prompt you to delete first org from list, or specify org alias or email `sfdx force:org:delete -u utam-recipes`
- recreate scratch orgs (repeat steps starting from step 3)


### Project setup

```bash
# download and install all project dependencies
yarn install
# generate Page Objects
yarn build
```
> Note: `yarn prepare` shows error if you run it more than once, it's normal because once yarn link is created it requires to unlink to run again.


### Running Tests

There are two types of WebdriverIO tests in this project. The first tests the custom app and components in this project by loading the app in a scratch org. The other loads a provided URL and logs in through the standard login page before beginning the test.

#### Testing the local app in a scratch org

These tests run under the assumption that the initial URL loaded contains an access token so no manual login is required. To generate such URL, follow the Org Setup steps above and then run
```bash
yarn generate:login
```

which runs the below `sfdx` command and adds the generated URL to the `.env` file in the root of this project.

```bash
sfdx force:org:open -p /lightning -r
```

After completing the above, run tests with:
```
yarn test --spec force-app/test/sfdx-scratch-org.spec.js
```

#### Testing CRUD operations against a target org

These tests require login credentials to an existing org. Note that the CRUD tests will modify real records in the org so only sandbox or development specific orgs should be used.

Provide the org login details as environment variables. Here is an example run:

```
MY_ORG_URL=my-sandbox.com MY_ORG_USERNAME=user@foo.com MY_ORG_PASSWORD=password yarn test --spec force-app/test/crud.spec.js
```

[enable-dev-hub]: https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_setup_enable_devhub.htm
