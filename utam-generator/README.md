# utam-generator

UTAM Generator generates JSON UTAM Page Objects from HTML files.

Documentation is available on [utam.dev](https://utam.dev/tools/generator-start).

## Generate page objects 

> To setup this repository please follow instructions in [root README](https://github.com/salesforce/utam-js#readme)

- Create new folder under `packages/utam-generator/src`
- Copy HTML files or component sources in the folder. Generator will recursively scan inside the folder, so folder can have any number of subfolders
- Run generator __from the project root__

```bash
yarn generate:utam
```
OR
```bash
yarn build
```
`yarn build` also generates page object whereas `yarn generate:utam` only generates and could run faster.

- Generated JSON files will be created in the folder configured as `outputDir` in generator.config.json (`__generated__`)
- After generation, JSON files will be compiled by UTAM compiler to validate generated syntax is correct.