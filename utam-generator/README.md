# utam-generator

UTAM Generator is a utility that generates JSON UTAM Page Objects from HTML files.

## Generate page objects 

> To setup this repository please follow instructions in [root README](https://github.com/salesforce/utam-js#readme)

1. Create new folder under packages/utam-generator/src
2. Put HTML files in the folder. Generator will recursively scan inside the folder, so folder can have any number of subfolders
3. 
4. Run generator __from the project root__

```bash
yarn generate:utam
```
OR
```bash
yarn build
```
`yarn build` also generates page object whereas `yarn generate:utam` only generates and could run faster.

5. Generated JSON files will be created in the folder configured as `outputDir` in generator.config.json (`__generated__`)
6. After generation, JSON files will be compiled by UTAM compiler to validate generated syntax is correct.