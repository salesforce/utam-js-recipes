# Contributing to UTAM Recipes SFDX

-   [Code of Conduct](#code-of-conduct)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Git Workflow](#git-workflow)

## [Code of Conduct](./CODE_OF_CONDUCT.md)

The UTAM Recipes SFDX project has a [Code of Conduct](./CODE_OF_CONDUCT.md) to which all contributors must adhere.

## Requirements

-   [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)
-   [Node](https://nodejs.org/) >= 14.15.4
-   [Yarn](https://yarnpkg.com/) >= 1.22.5

This project uses [Volta](https://volta.sh/) to ensure that all the contributors share the same version of `Node` and `Yarn` for development. If you are considering making frequent contributions to this project, we recommend installing Volta.

If you install Volta, run this command to install node and yarn:

```bash
$ volta install node yarn
```

## Installation

[Set up SSH access to GitHub][setup-github-ssh] if you haven't done so already.

### 1) Setup your Salesforce DX environment

If you don't have an SFDX environment set up, you need to set up one before contributing to the project.
To set up your Salesforce DX environment, follow the [Prerequisites][readme-prerequisites] and [Org Setup][readme-org-setup] sections from the [README](./README.md).

### 2) Fork the repository

We recommend that you [fork][fork-a-repo] the [salesforce/utam-js-recipes](https://github.com/salesforce/utam-js-recipes) repo.

After you fork the repo, [clone][clone-a-repo] your fork in your local workspace:

```bash
$ git clone git@github.com<YOUR-USERNAME>/utam-js-recipes.git
$ cd utam-js-recipes
```

### 3) Install dependencies

_We use [yarn](https://yarnpkg.com/) because it is significantly faster than npm for our use case. See this command [cheatsheet](https://yarnpkg.com/lang/en/docs/migrating-from-npm/)._

```bash
$ yarn install
```

### 4) Build the project

Execute `yarn build` to build the project and generate page objects.

If you change a page object or test later, run `yarn build` to update the project.

### 5) Run Tests

Once the project has been built, execute tests as indicated in the [running tests][readme-running-tests] section of the README.

## Git Workflow

The process of submitting a pull request is straightforward and generally follows the same pattern each time:

1. [Fork the UTAM JS Recipes repo](#fork-the-utam-js-recipes-repo)
2. [Create a feature branch](#create-a-feature-branch)
3. [Make your changes](#make-your-changes)
4. [Rebase](#rebase)
5. [Create a pull request](#create-a-pull-request)
6. [Update the pull request](#update-the-pull-request)

### Fork the UTAM JS Recipes repo

[Fork][fork-a-repo] the [salesforce/utam-js-recipes](https://github.com/salesforce/utam-js-recipes) repo. Clone your fork in your local workspace and [configure][configuring-a-remote-for-a-fork] your remote repository settings.

```bash
$ git clone git@github.com:<YOUR-USERNAME>/utam-js-recipes.git
$ cd utam-js-recipes
$ git remote add upstream git@github.com:salesforce/utam-js-recipes.git
```

### Create a feature branch

```bash
$ git checkout master
$ git pull origin master
$ git checkout -b <name-of-the-feature>
```

### Make your changes

Modify the files, lint, format and commit your code using the following commands:

```bash
$ git add <path/to/file/to/commit>
$ git commit
$ git push origin <username>/<name-of-the-feature>
```

The above commands will commit the files into your feature branch. You can keep
pushing new changes into the same branch until you are ready to create a pull
request.

### Rebase

Sometimes your feature branch will get stale with respect to the master branch,
and it will require a rebase. The following steps can help:

```bash
$ git checkout master
$ git pull origin master
$ git checkout <name-of-the-feature>
$ git rebase upstream/master
```

> Note: If no conflicts arise, these commands will ensure that your changes are applied on top of the master branch. Any conflicts will have to be manually resolved.

### Create a pull request

If you've never created a pull request before, follow [these instructions][creating-a-pull-request].

### Update the pull request

```bash
$ git fetch origin
$ git rebase origin/${base_branch}

# If there were no merge conflicts in the rebase
$ git push origin ${feature_branch}

# If there was a merge conflict that was resolved
$ git push origin ${feature_branch} --force
```

> Note: If more changes are needed as part of the pull request, just keep committing and pushing your feature branch as described above and the pull request will automatically update.

[clone-a-repo]: https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository
[fork-a-repo]: https://help.github.com/en/articles/fork-a-repo
[configuring-a-remote-for-a-fork]: https://help.github.com/en/articles/configuring-a-remote-for-a-fork
[setup-github-ssh]: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/
[readme-prerequisites]: ./README.md#prerequisites
[readme-org-setup]: ./README.md#org-setup
[readme-running-tests]: ./README.md#running-tests
[creating-a-pull-request]: https://help.github.com/articles/creating-a-pull-request/
